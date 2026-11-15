import { mkdir, copyFile, access, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const assets = path.join(root, 'src/assets');
const originals = path.join(root, 'originals');
await mkdir(originals, { recursive: true });

// Keep original uploads outside the deployed assets. Match each card's focal point.
const photos = [
  { name: 'fateh-sagar', file: 'fateh-sagar.jpg', y: 0.5 },
  { name: 'gulab-bagh', file: 'gulab-bagh.jpg', y: 0.52 },
  { name: 'jogi-talab', file: 'jogi-talab.png', y: 0.45 },
  { name: 'jungle-safari-park', file: 'jungle-safari-park.jpg', y: 0.45 },
  { name: 'menar', file: 'menar.jpg', y: 0.5 },
  { name: 'nela-talab', file: 'nela-talab.jpg', y: 0.65 },
  { name: 'pichola', file: 'pichola.jpg', y: 0.5 },
  { name: 'udaan-park', file: 'udaan-park.jpg', y: 0.28 },
  { name: 'sunbird', file: 'sunbird.jpg', hero: true },
];

const report = [];
for (const photo of photos) {
  const original = path.join(originals, photo.file);
  try { await access(original); } catch { await copyFile(path.join(assets, photo.file), original); }
  const metadata = await sharp(original).rotate().metadata();
  const width = metadata.autoOrient?.width ?? metadata.width;
  const height = metadata.autoOrient?.height ?? metadata.height;
  if (!width || !height) throw new Error(`Cannot read dimensions: ${photo.file}`);

  let image = sharp(original).rotate();
  if (!photo.hero) {
    // Crop unused portrait pixels before transfer, not just in the browser.
    const cropWidth = Math.min(width, Math.round(height * 1.6));
    const cropHeight = Math.min(height, Math.round(width / 1.6));
    image = image.extract({
      left: Math.round((width - cropWidth) * 0.5),
      top: Math.round((height - cropHeight) * photo.y),
      width: cropWidth,
      height: cropHeight,
    });
  }
  const output = path.join(assets, `${photo.name}.webp`);
  const result = await image
    .resize({ width: photo.hero ? 1024 : 960, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);
  report.push({ file: `${photo.name}.webp`, originalBytes: (await stat(original)).size, optimizedBytes: result.size, width: result.width, height: result.height });
}
const originalBytes = report.reduce((sum, item) => sum + item.originalBytes, 0);
const optimizedBytes = report.reduce((sum, item) => sum + item.optimizedBytes, 0);
const summary = { originalBytes, optimizedBytes, reductionPercent: Math.round((1 - optimizedBytes / originalBytes) * 100), photos: report };
if (process.env.IMAGE_REPORT_PATH) {
  await writeFile(process.env.IMAGE_REPORT_PATH, JSON.stringify(summary, null, 2));
}
console.log(JSON.stringify(summary, null, 2));
