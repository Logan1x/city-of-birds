import { mkdir, readFile, writeFile, rename, access, readdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { RADIUS_KM, LIMIT, POLICY_VERSION, observationSearchUrl, selectObservations, cachedObservations, selectionKey } from './lib/observations.mjs';

const root = new URL('../', import.meta.url);
const centers = JSON.parse(await readFile(new URL('src/data/spot-coordinates.json', root), 'utf8'));
const selections = JSON.parse(await readFile(new URL('src/data/observation-selections.json', root), 'utf8'));
for (const [id, ids] of Object.entries(selections)) {
  if (!/^[a-z0-9-]+$/.test(id) || !Array.isArray(ids) || !ids.length || ids.length > LIMIT
    || new Set(ids).size !== ids.length || !ids.every(id => Number.isSafeInteger(id) && id > 0)) {
    throw new Error(`Invalid member observation selection: ${id}`);
  }
}
const snapshotPath = new URL('src/data/observations.json', root);
const photoDirectory = new URL('public/observations/', root);
await mkdir(photoDirectory, { recursive: true });
let previous;
try { previous = JSON.parse(await readFile(snapshotPath, 'utf8')); } catch { /* First run has no saved observations. */ }
const snapshot = { policyVersion: POLICY_VERSION, radiusKm: RADIUS_KM, limit: LIMIT, spots: {} };

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'CityOfBirds/1.0 (https://github.com/Logan1x/city-of-birds)' } });
  if (!response.ok) throw new Error(`iNaturalist returned HTTP ${response.status}`);
  return response;
}

for (const id of new Set([...Object.keys(centers), ...Object.keys(selections)])) {
  const center = centers[id] ?? null;
  const selectedIds = selections[id] ?? [];
  const key = selectionKey(selectedIds);
  try {
    const url = selectedIds.length
      ? `https://api.inaturalist.org/v1/observations/${selectedIds.join(',')}`
      : observationSearchUrl(center, true);
    const data = await (await get(url)).json();
    if (!Array.isArray(data.results)) throw new Error('Unexpected observation response');
    const candidates = selectObservations(data.results, center, 30, { selectedIds });
    const observations = [];
    for (const candidate of candidates) {
      if (!candidate.photo) {
        observations.push(candidate);
        if (observations.length === LIMIT) break;
        continue;
      }
      const filename = `${candidate.photo.id}.webp`;
      const target = new URL(filename, photoDirectory);
      try {
        try { await access(target); } catch {
          const response = await get(candidate.photo.sourceUrl);
          const bytes = Buffer.from(await response.arrayBuffer());
          if (bytes.length > 5_000_000) throw new Error('Photo exceeds thumbnail size limit');
          await sharp(bytes, { limitInputPixels: 25_000_000 }).rotate()
            .resize(112, 112, { fit: 'cover' }).webp({ quality: 78 }).toFile(fileURLToPath(target));
        }
        observations.push({ ...candidate, photo: { ...candidate.photo, src: `/observations/${filename}` } });
      } catch (error) {
        console.warn(`[observations] Skipping photo ${candidate.photo.id}: ${error.message}`);
        if (selectedIds.length) observations.push({ ...candidate, photo: null });
      }
      if (observations.length === LIMIT) break;
    }
    // A photo-host outage must not replace a useful saved collection with emptiness.
    if (candidates.length && !observations.length) throw new Error('Matching photos could not be loaded');
    snapshot.spots[id] = { center, selectionKey: key, status: 'ready', fetchedAt: new Date().toISOString(), observations };
    console.log(`[observations] ${id}: ${observations.length} ${center ? `within ${RADIUS_KM} km` : 'member-selected (no radius claim)'}`);
  } catch (error) {
    const cached = cachedObservations(previous, id, center, Date.now(), selectedIds);
    let reusable = Boolean(cached);
    if (reusable) {
      try {
        for (const item of cached.observations) if (item.photo) await access(new URL(`public/observations/${item.photo.id}.webp`, root));
      } catch { reusable = false; }
    }
    snapshot.spots[id] = reusable
      ? { ...cached, status: 'cached' }
      : { center, selectionKey: key, status: 'unavailable', fetchedAt: null, observations: [] };
    console.warn(`[observations] ${id}: ${error.message}; ${reusable ? 'using saved observations' : 'showing unavailable state'}`);
  }
  // Stay below iNaturalist's requested 60 API calls/minute.
  await new Promise(resolve => setTimeout(resolve, 1100));
}
await writeFile(new URL('src/data/observations.json.tmp', root), JSON.stringify(snapshot, null, 2) + '\n');
await rename(new URL('src/data/observations.json.tmp', root), snapshotPath);
// This directory contains generated thumbnails only. Don't keep publishing photos
// that disappeared from the current results or whose reusable cache expired.
const referencedPhotos = new Set(Object.values(snapshot.spots).flatMap(entry => entry.observations.filter(item => item.photo).map(item => `${item.photo.id}.webp`)));
for (const filename of await readdir(photoDirectory)) {
  if (/^\d+\.webp$/.test(filename) && !referencedPhotos.has(filename)) await unlink(new URL(filename, photoDirectory));
}
