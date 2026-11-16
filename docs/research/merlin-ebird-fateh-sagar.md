# Merlin/eBird for Fateh Sagar: official-source findings

Research date: 2026-11-16. Scope: **24.6012962, 73.6796795; fixed 1 km radius**, no photos required. Research only; no application changes, account creation, credentials, or API-key requests. This note combines official documentation with a live public Fateh Sagar sample checked in the connected browser.

## Bottom line

**Use eBird for the pilot, not a presumed public Merlin observations feed.** Cornell explicitly excludes saved Merlin IDs from public eBird outputs; Sound ID recordings stay on the device unless manually exported. The public Fateh Sagar hotspot has useful counts/checklists and a newer listed checklist than the latest matching iNaturalist record, but **better coverage inside the exact 1 km circle remains unproven**. Removing our photo/licence filter also substantially increases available iNaturalist records. A matched spatial/time comparison is still needed. [1–4,9–12]

## Verified: what Merlin contributes

- Saving “This is my bird!” creates a personal Merlin life-list observation. Dates/locations remain private unless shared. These records can be managed through the eBird account interface, **but are not part of public eBird displays/output**, species maps, recent visits, Explore, or Alerts, and do not undergo the eBird review process. Seeing an eBird-style checklist in the account does not mean a public eBird submission. [1]
- The synchronization is not symmetric: the Merlin life list includes species submitted on the user's eBird checklists; that does not make Merlin saves public eBird data. [1]
- Saved Sound ID recordings are stored only on the phone and are **never automatically transmitted to Cornell**. A person must export a recording and manually attach it to an eBird checklist to share it through eBird/Macaulay Library. Sound ID suggestions require human confirmation and can be wrong. [2]
- These official sources do not document a public Merlin nearby-sightings API. They support using **public eBird submissions**, not harvesting Merlin users' private IDs or audio sessions. [1–3]

## Verified: eBird access and useful API behavior

| Need | Officially documented behavior | Consequence for this spot |
| --- | --- | --- |
| App access | API v2 uses an account-linked personal API key, normally `x-ebirdapitoken`; default response is JSON. Key generation redirects to Cornell sign-in. [3,4] | Ask the user before acquiring a key. Keep a production key server-side; do not expose/share it. |
| Nearby recent birds | `GET /v2/data/obs/geo/recent`; `lat`, `lng`; `dist` in km, 0–50, default 25; `back` 1–30 days, default 14. [3] | Explicitly use the requested center, `dist=1`, and a stated window such as `back=30`; never silently accept 25 km. |
| Result meaning | Nearby recent returns **only the most recent observation per species** in the requested area. Species-specific nearby returns the most recent observation per location. [3] | Row count is not the total number of observations, checklists, or individuals. Do not compare these summary rows directly with iNaturalist observation totals. |
| Coverage/options | `hotspot=false` means not restricted to hotspots; `includeProvisional=false` excludes observations not yet reviewed. Simple observation examples include names/codes, date, count when available, location/name/coordinates, validity/review indicators, and `subId`; photos are not required fields. [3] | Start without hotspot-only restriction. Interpret absent count as unknown, not zero. |
| Hotspots | `/v2/ref/hotspot/geo` finds nearby hotspot locations; `/v2/data/obs/{locId}/recent` summarizes recent species at one location; `/v2/product/spplist/{regionCode}` provides a species list, not a date/radius occurrence inventory. [3] | Hotspot all-time species totals are not evidence of observations within the 1 km circle or recent window. |

Illustrative request only, **not an executed successful observation query**:

```text
GET https://api.ebird.org/v2/data/obs/geo/recent?lat=24.6012962&lng=73.6796795&dist=1&back=30&hotspot=false&includeProvisional=false
Header: x-ebirdapitoken: <user-authorized key>
```

**Precision/access caveats:** the published API parameter tables describe latitude/longitude “to 2 decimal places”; this investigation did not verify whether the service rounds or accepts full precision. Do not round the requested center and call the result an exact match without testing. Nearby-hotspot docs also conflict internally (intro says up to 50 km; parameter table says 0–500); 1 km is within both, so no wider-radius claim is needed. [3]

For history, the API also has a date-specific regional/location endpoint; it is not a generic all-history radius download. Cornell describes the API as limited, recent, and summary output. The **eBird Basic Dataset (EBD)** offers species/checklist rows with coordinates and effort metadata, updated monthly; access requires login, a project description, and approval (typically within seven days). The annual **EOD via GBIF** contains basic occurrence fields but not effort metadata. Neither is a live Merlin feed. [3,4]

## Spatial interpretation: pins are not exact bird locations

Cornell says public coordinates are **one observer-selected coordinate pair for each checklist**, and GPS tracks are not public. A hotspot can represent an area or a traveling route, not just its map pin. Cornell specifically distinguishes stationary observations from traveling checklists at the same hotspot. [5,6]

Therefore (interpretation of those documented semantics):

1. A hotspot pin within 1 km does **not** prove every bird on its checklists was seen within 1 km; a lake-wide hotspot can straddle the circle.
2. A pin outside 1 km does not prove all underlying birds were outside it. Do not include an outside hotspot merely because its name says Fateh Sagar.
3. Recompute geodesic distance from returned location coordinates to the unchanged center for validation, but label this **checklist-location distance**, not exact bird distance. Do not claim a route-level spatial guarantee unavailable from public data.
4. Do not “fix” precision by widening the recent summary query and then dropping outside rows: its one-record-per-species selection can choose an outside observation and conceal an inside observation of the same species. Obtain appropriate location-level/raw data if a strict comparison requires it. [3,5,6]

## Licensing and attribution: public does not mean unrestricted

The API Terms explicitly incorporate the Data Access Terms. Both were read in Cornell's public pages (API Terms last edited 2021-10-19; Data Access Terms last updated 2020-11-09). [7,8]

- **Non-commercial permission:** API use is licensed for non-commercial purposes including websites/mobile applications. Commercial use requires prior written permission from Cornell (`ebird@cornell.edu`); the definition includes use by/on behalf of a for-profit entity and nonprofit revenue generation. Merely making an app free does not establish eligibility. [7,8]
- **Attribution:** attribute **eBird.org wherever API data are used/displayed**, with a link when possible. Preserve copyright/proprietary notices; do not imply endorsement or use Cornell/eBird logos without permission. [7,8]
- **Redistribution:** do not publish/pass on original eBird datasets in original format, whole or part. Derived datasets may be passed on only under the same Terms; purpose restrictions and supplying Cornell an electronic copy of published products also apply. An app display is explicitly contemplated by API terms, but a raw JSON-download/mirror feature should not be assumed permitted. [7,8]
- **Operational:** protect the account/key, do not share keys with third parties, and avoid server-adverse request patterns; Cornell may revoke access. Cache responsibly rather than scraping/bulk-polling endpoints. No numerical rate limit was established here. [7]
- **Media:** photos/audio/video have separate rights; contributors retain copyright. Not using media removes that separate clearance task, **not** the data-license/attribution obligations. Sensitive species/privacy restrictions also affect public coverage. [4,5]

## Actual data obtained and limitations

### Live eBird sample

The public hotspot search resolved **Fateh Sagar Lake, Udaipur, IN-RJ** to **L4718989**. Its page showed **197 species, 240 checklists, 149 eBirders**, as all-time hotspot totals. These are not 1 km-filtered observation counts. [9]

The hotspot’s Directions link contains **24.5996048907953,73.6731613671509**, about **0.685 km** from our unchanged centre (haversine distance). This puts the marker inside the circle, not necessarily every checklist observation. [9]

The latest listed checklist was **S408369339, 6 November 2026, 12:34 PM**, by **ABHISHEK PALIWAL**. It contains 4 species and 8 individuals, is marked complete, and uses the **Traveling** protocol over **0.46 km**, duration **1 minute**. Three text-only example records from it are: [10]

| Bird | Number observed | Observation date |
| --- | ---: | --- |
| Black-winged Stilt | 1 | 6 Nov 2026 |
| Little Cormorant | 3 | 6 Nov 2026 |
| Glossy Ibis | 1 | 6 Nov 2026 |

The fourth species is Rock Pigeon (Feral Pigeon), count 3. These are entries from **one checklist**, not three independent visits or exact bird coordinates. A traveling route of 0.46 km from a representative point 0.685 km away cannot establish a strict 1 km occurrence guarantee. No protected route coordinates were requested. [5,6,10]

### iNaturalist comparison without pictures

The same public research-grade/wild/open-geoprivacy 1 km API search returned **146 observations** when no photo or photo-licence condition was applied, versus **9** with our existing `photos=true&photo_license=cc0,cc-by,cc-by-sa` filter. After repeating our local privacy/threatened-taxon, distance, accuracy (when supplied), and account checks, **134** of the 146 remained usable as text-only candidates. These counts describe research-grade records, not unique species. [11,12]

The latest three matching iNaturalist records were Black-winged Stilt and White-throated Kingfisher (Indian), both **4 Nov 2026**, and Little Cormorant, **31 Oct 2026**. A search from 17 Oct 2026 onward returned 4 API records before additional local filtering. No site data filters were changed for this research. [11]

The eBird hotspot’s 197 species / 240 checklists must **not** be compared numerically with iNaturalist’s 146 raw / 134 locally eligible individual observations as if they measured the same thing. Different spatial coverage, aggregation, time windows and quality/review policies apply. For this pilot, eBird demonstrates useful checklist counts and a fresher latest listed visit, not proven superiority within the exact radius.

### Access limitations

Official support docs and the public Postman API collection were readable without credentials. API-key generation displayed Cornell login; no login or key acquisition was attempted. Search returned HTTP 402. A documentation fetch of the eBird science page returned an anti-bot interstitial and was not challenged/retried. Cornell Terms initially returned HTTP 403 to text fetch but were readable normally in an independently opened, read-only browser tab. The main public hotspot/checklist browser visits briefly showed automatic bot-check loading screens, then loaded normally; no challenge was solved, bypassed, or retried. The live eBird sample came from those public pages, **not an authenticated successful radius-API response**.

## Recommendation

Pilot **eBird as an additional bird source**, not “Merlin observations” and not a proven iNaturalist replacement. With user-authorized API access, measure species coverage and freshness for this same center/radius and an identical 30-day window, accounting for checklist-pin uncertainty and one-result-per-species API semantics. If the app needs all-time occurrence/checklist density, request EBD access (and clarify intended use/redistribution permissions) rather than treating recent API summaries or hotspot lifetime totals as raw counts. [3–8]

## Primary sources

1. Cornell/eBird Help: [Saving birds identified with Merlin](https://support.ebird.org/en/support/solutions/articles/48001144489-saving-birds-identified-with-merlin).
2. Cornell/eBird Help: [Sound ID](https://support.ebird.org/en/support/solutions/articles/48001185783-sound-id).
3. Official [eBird API 2.0 documentation](https://documenter.getpostman.com/view/664302/S1ENwy59), also retrieved as its public [Postman collection JSON](https://documenter.gw.postman.com/api/collections/664302/S1ENwy59?segregateAuth=true&versionTag=latest). Cornell's own support links to this documentation.
4. Cornell/eBird Help: [Download eBird Data](https://support.ebird.org/en/support/solutions/articles/48000838205-download-ebird-data); [API key request page](https://ebird.org/api/keygen) (login required).
5. Cornell/eBird Help: [eBird Data Privacy and Data Use](https://support.ebird.org/en/support/solutions/articles/48001078113-ebird-data-privacy-and-data-use).
6. Cornell/eBird Help: [eBird Hotspot FAQs](https://support.ebird.org/en/support/solutions/articles/48001009443-ebird-hotspot-faqs) and [Choosing and Managing Locations](https://support.ebird.org/en/support/solutions/articles/48000850891-choosing-and-managing-locations-in-ebird).
7. Cornell: [eBird API Terms of Use](https://www.birds.cornell.edu/home/ebird-api-terms-of-use/), especially §§1–3, 5.
8. Cornell: [eBird Data Access Terms of Use](https://www.birds.cornell.edu/home/ebird-data-access-terms-of-use/).
9. eBird.org: [Fateh Sagar Lake hotspot L4718989](https://ebird.org/hotspot/L4718989), live totals and Directions link read 16 Nov 2026.
10. eBird.org / ABHISHEK PALIWAL: [Checklist S408369339](https://ebird.org/checklist/S408369339), 6 Nov 2026, live checklist read 16 Nov 2026.
11. iNaturalist: [Fateh Sagar 1 km public research-grade bird query, no photo requirement](https://api.inaturalist.org/v1/observations?lat=24.6012962&lng=73.6796795&radius=1&taxon_id=3&quality_grade=research&captive=false&geo=true&geoprivacy=open&taxon_geoprivacy=open&per_page=200&order_by=observed_on&order=desc), retrieved 16 Nov 2026. Local eligibility checks use the existing project’s haversine/privacy/accuracy rules without its photo requirement.
12. iNaturalist: [Same query with the current reusable-photo filter](https://api.inaturalist.org/v1/observations?lat=24.6012962&lng=73.6796795&radius=1&taxon_id=3&quality_grade=research&captive=false&geo=true&geoprivacy=open&taxon_geoprivacy=open&photos=true&photo_license=cc0,cc-by,cc-by-sa&per_page=3&order_by=observed_on&order=desc), retrieved 16 Nov 2026.
