# City of Birds

A single-page birding guide for Udaipur and nearby. Built with Astro, TypeScript, and CSS. No accounts, database, API keys, or embedded maps.

## Run locally

Requires Node.js 22.23.4+ (tested with Node 24).

```sh
npm ci
npm run dev
```

Open the URL printed by Astro. The current workspace preview is at `http://localhost:4323`; Astro may pick another port if that port is occupied.

## Check and test

```sh
npm run build
npx playwright install chromium
TEST_URL=http://localhost:4323 npm test
```

Run the tests against a running development or preview server. `TEST_URL` defaults to `http://localhost:4323` for this workspace. Tests cover desktop and 360px mobile layouts, combined search and filtering, empty-state reset, keyboard disclosures, hash links, images, Maps URL destinations, reduced motion, no-JavaScript use, and automated WCAG AA checks. Automated checks are not a substitute for a screen-reader or real-phone test.

To test the production output, serve `dist/` with any static web server and set `TEST_URL` to its origin.

## Edit the guide

- `src/data/spots.ts`: spots, bird records, photo credits, map pins, access notes, and check date.
- `src/pages/index.astro`: page content, header, hero, basics, and footer.
- `src/components/SpotCard.astro`: card and native details disclosure.
- `src/styles/global.css`: cream `#FFF8EB`, indigo `#5549DE`, pink `#EE91F5`, and responsive styles.
- `src/scripts/discovery.ts`: progressive-enhancement search, filtering, deep links, and pointer feedback. Add `data-static` to a pressable control to disable scale feedback.

Cards remain readable, expandable, and linked to Maps without JavaScript. Search and filter controls appear only when their script initializes. Photos and fonts are served locally; the site makes no runtime requests to tourism, observation, map, or font services until someone follows an external link.

## Content status

The collection has nine spots: Roop Sagar, Jungle Safari Park, Udaan Park, Menar Wetland Complex, Nela Talab, Jogi Talab, Fateh Sagar, Lake Pichola, and Gulab Bagh. Roop Sagar uses the owner-shared Google Maps URL directly: the redirect could not be reached during this update, so no coordinates or inspected entrance are asserted. Its owner-supplied photo shows the lake framed by a palm tree and brick wall; the original photographer and reuse licence were not specified. The earlier five additions retain their original shared URLs in their sources; their coordinates come from the resolved place marker (`!3d` / `!4d`), not the map viewport center. Menar is explicitly labelled as outside Udaipur city.

Menar has a CC BY photograph of a spoonbill recorded at Menar Lake, credited to Mathieu Soetens. Udaan Park uses the portrait photo supplied by the user in chat (originally JPEG despite the attachment’s `.png` name); its original photographer and reuse licence were not specified, so no CC licence is asserted. Original files are preserved in `originals/`; active images are cropped and optimized WebP copies in `src/assets/`.

Jungle Safari Park uses the user-supplied landscape photo of its pavilion, lawn, and trees; the original photographer and reuse licence were not specified. Its Sunday closure notice remains visible on the card.

Nela Talab uses the user-supplied portrait photo of its lakeside promenade, railings, and hills; the original photographer and reuse licence were not specified. The crop prioritises the promenade and water rather than the bright sky.

Jogi Talab uses the user-supplied square image of palm trees reflected in the lake; the original photographer and reuse licence were not specified. All nine spot cards have location photos.

The five additions do not have verified species checklists or entrance inspections; the cards say so. The original three cards cite community observations covering the broader habitat, not guaranteed sightings at their pins. Suggested-time and season rows were removed from every card at the user’s request. The Sunday closure is a compact photo badge, not a separate row.

The Fateh Sagar pin is the Pal promenade; Pichola opens Gangaur Ghat. **Gulab Bagh currently opens the Main Road approach, not a verified entrance gate.** Check its current public gate locally and update the coordinates before a public launch. Online listings and sources were reviewed on 15 November 2026; no field inspection has been performed. Do not describe these pins as on-site verified.

Do not add sensitive nesting coordinates, captive birds as wild sightings, unverified access hours, or further distant destinations without checking scope. The user explicitly expanded scope to Menar with the five shared pins. Review photo permissions separately from the observation record’s license.

## Photography and fonts

| Asset | Creator and source | License |
| --- | --- | --- |
| `src/assets/sunbird.webp` | [Gannu03, Purple sunbird observed in Udaipur](https://www.inaturalist.org/observations/213746821) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `src/assets/fateh-sagar.webp` | [WikiAnchor10, Fateh Sagar Lake, Udaipur1.jpg](https://commons.wikimedia.org/wiki/File:Fateh_Sagar_Lake,_Udaipur1.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `src/assets/pichola.webp` | [Uri Sittan / Tripo, Udaipur Lake India.JPG](https://commons.wikimedia.org/wiki/File:Udaipur_Lake_India.JPG) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `src/assets/gulab-bagh.webp` | [Vishal0soni, GulabBagh.jpg](https://commons.wikimedia.org/wiki/File:GulabBagh.jpg) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `src/assets/menar.webp` | [Mathieu Soetens, Eurasian spoonbill at Menar Lake](https://www.inaturalist.org/observations/262804805) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `src/assets/udaan-park.webp` | User-supplied Udaan Park photo | Original photographer and reuse licence not specified; do not infer a Creative Commons licence |
| `src/assets/jungle-safari-park.webp` | User-supplied Jungle Safari Park photo | Original photographer and reuse licence not specified; do not infer a Creative Commons licence |
| `src/assets/nela-talab.webp` | User-supplied Nela Talab photo | Original photographer and reuse licence not specified; do not infer a Creative Commons licence |
| `src/assets/jogi-talab.webp` | User-supplied Jogi Talab photo | Original photographer and reuse licence not specified; do not infer a Creative Commons licence |
| `src/assets/roop-sagar.webp` | User-supplied Roop Sagar photo | Original photographer and reuse licence not specified; do not infer a Creative Commons licence |

Photos are resized, compressed, and cropped for display under their respective licenses. ShareAlike applies to the images carrying that condition; the Menar image is CC BY. Attribution is also available in the page. Images show the named lake or garden, not necessarily its linked entrance. The Menar image shows one bird observation, not a full species checklist. The hero shows a bird recorded in Udaipur, not a promised sighting at any card’s map pin.

Barlow Condensed and DM Sans are self-hosted through Fontsource under the SIL Open Font License; license files are included in their packages. The bird mark, icons, and social image are original vector artwork made for this app.

## Image optimization

All ten photographs (nine cards and the hero) use WebP source files. Original uploads/downloads are archived under `originals/`, outside the deploy output. Card crops are prepared at a 1.6:1 ratio using their chosen focal points, so unused portrait pixels are not downloaded. The hero keeps its full composition. No source is enlarged; Astro generates responsive WebP variants, with eager loading for the hero and lazy loading for cards. Hashed `/_astro/` assets get one-year immutable browser caching through `public/_headers`.

Regenerate the active WebP files from the archived originals:

```sh
npm run images:optimize
```

The script uses quality 82 and a maximum card width of 960px. The ten active source files total 729,532 bytes, down from 2,274,296 bytes in the originals (68% smaller). These are source totals, not a measured page-load improvement. Astro’s responsive delivery sizes vary by viewport. Set `IMAGE_REPORT_PATH` to write the JSON conversion report to a chosen path.

## Cloudflare deployment

Public URL: https://city-of-birds.khushal20210-t1kxhglw.workers.dev

The site is deployed as a static-assets-only Cloudflare Worker named `city-of-birds`. `wrangler.jsonc` pins the target account and serves `dist/`. There is no server-side adapter, storage binding, or custom-domain route. No existing Worker was overwritten.

The Cloudflare `cf` beta does not support building Astro 6+ at the time of setup, so this project uses the [documented manual Astro static-site setup](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#if-you-have-a-static-site) with project-local Wrangler. Keep using Wrangler here; do not run `cf init .` over the configuration.

```sh
npx wrangler whoami
npm run deploy
```

`npm run deploy` runs the full checked production build before uploading assets. To validate without publishing:

```sh
npm run build
npx wrangler deploy --dry-run
npx wrangler dev --local --port 8789
```

Run the browser suite against that local Workers server with `TEST_URL=http://localhost:8789 npm test`. The suite can also be run against the public URL.

The canonical URL, social-image URL, robots sitemap reference, and sitemap now default to the public deployment origin. Override `SITE_URL` when moving to a custom domain, and configure the domain separately; the environment variable does not change DNS or Cloudflare routes.

Remaining content and device checks:

1. Verify the Gulab Bagh gate and review access notes locally.
2. Test Maps handoff on a physical Android phone and iPhone; app opening depends on device settings.
3. Test keyboard focus, screen-reader output, mobile safe areas, and large text on real devices.
4. Review link previews in the intended messaging and social apps.
