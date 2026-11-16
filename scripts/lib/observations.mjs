export const RADIUS_KM = 1;
export const LIMIT = 3;
export const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const POLICY_VERSION = 3;

export function selectionKey(ids = []) {
  return ids.length ? ids.join(',') : 'latest';
}

const licenses = {
  cc0: { name: 'CC0', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  'cc-by': { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  'cc-by-sa': { name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  'cc-by-nc': { name: 'CC BY-NC 4.0', url: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  'cc-by-nc-sa': { name: 'CC BY-NC-SA 4.0', url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' },
};

export function parseCoordinates(value) {
  if (typeof value !== 'string' || !/^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(value)) return null;
  const [lat, lng] = value.split(',').map(Number);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null;
}

export function distanceKm(a, b) {
  const radians = degrees => degrees * Math.PI / 180;
  const h = Math.sin(radians(b[0] - a[0]) / 2) ** 2
    + Math.cos(radians(a[0])) * Math.cos(radians(b[0])) * Math.sin(radians(b[1] - a[1]) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

export function observationSearchUrl(center, api = false) {
  const coordinates = parseCoordinates(center);
  if (!coordinates) throw new Error('A valid search centre is required');
  const url = new URL(api ? 'https://api.inaturalist.org/v1/observations' : 'https://www.inaturalist.org/observations');
  const params = {
    lat: String(coordinates[0]), lng: String(coordinates[1]), radius: String(RADIUS_KM),
    taxon_id: '3', captive: 'false', photos: 'true', geo: 'true',
    geoprivacy: 'open', taxon_geoprivacy: 'open', photo_license: Object.keys(licenses).join(','),
    order_by: 'observed_on', order: 'desc',
  };
  if (api) params.per_page = '30';
  url.search = new URLSearchParams(params).toString();
  return url.href;
}

// The API filters are repeated locally: don't publish obscured/sensitive records,
// captive birds, out-of-radius points, or photos without a reusable licence.
export function selectObservations(results, center, limit = LIMIT, { selectedIds = [] } = {}) {
  const origin = parseCoordinates(center);
  const curated = selectedIds.length > 0;
  if ((!origin && !curated) || !Array.isArray(results)) return [];
  const selected = [];
  const seen = new Set();
  const sorted = curated
    ? selectedIds.map(id => results.find(observation => observation?.id === id))
    : [...results].sort((a, b) => String(b?.observed_on ?? '').localeCompare(String(a?.observed_on ?? '')) || (b?.id ?? 0) - (a?.id ?? 0));
  for (const observation of sorted) {
    if (!observation || !Number.isSafeInteger(observation.id) || observation.id <= 0 || seen.has(observation.id)) continue;
    const taxon = observation.taxon;
    if (!['research', 'needs_id', 'casual'].includes(observation.quality_grade) || observation.captive !== false || observation.obscured
      || ![null, undefined, 'open'].includes(observation.geoprivacy)
      || ![null, undefined, 'open'].includes(observation.taxon_geoprivacy)
      || !taxon?.ancestor_ids?.includes(3) || taxon.threatened || !taxon.name
      || observation.user?.spam || observation.user?.suspended) continue;
    const position = parseCoordinates(observation.location);
    if (!position || (origin && distanceKm(origin, position) > RADIUS_KM)) continue;
    if (observation.positional_accuracy != null && (!Number.isFinite(observation.positional_accuracy) || observation.positional_accuracy > 1000 || observation.positional_accuracy < 0)) continue;
    const date = observation.observed_on;
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)
      || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date
      || date > new Date().toISOString().slice(0, 10)) continue;
    const photo = observation.photos?.find(photo => {
      if (!licenses[photo.license_code] || photo.hidden || photo.flags?.length || !photo.attribution || !Number.isSafeInteger(photo.id)) return false;
      try {
        const url = new URL(photo.url);
        return url.protocol === 'https:' && ['static.inaturalist.org', 'inaturalist-open-data.s3.amazonaws.com'].includes(url.hostname)
          && url.pathname.startsWith(`/photos/${photo.id}/`) && /\/square\.(jpg|jpeg|png)$/i.test(url.pathname);
      } catch { return false; }
    });
    // Explicit member selections can be linked without copying restricted media.
    // Automatic selection still requires a reusable observation photo.
    if (!photo && !curated) continue;
    seen.add(observation.id);
    selected.push({
      id: observation.id,
      name: taxon.preferred_common_name || taxon.name,
      scientificName: taxon.name,
      observedOn: date,
      qualityGrade: observation.quality_grade,
      observer: observation.user?.name || observation.user?.login || 'iNaturalist member',
      url: `https://www.inaturalist.org/observations/${observation.id}`,
      photo: photo ? {
        id: photo.id, sourceUrl: photo.url.replace('/square.', '/small.'),
        attribution: photo.attribution, license: licenses[photo.license_code].name,
        licenseUrl: licenses[photo.license_code].url,
      } : null,
    });
    if (selected.length >= limit) break;
  }
  return selected;
}

export function canUseCache(entry, center, now = Date.now()) {
  const age = now - Date.parse(entry?.fetchedAt);
  return entry?.center === center && Array.isArray(entry.observations)
    && ['ready', 'cached'].includes(entry.status) && age >= 0 && age <= MAX_CACHE_AGE_MS;
}

export function cachedObservations(snapshot, id, center, now = Date.now(), selectedIds = []) {
  if (snapshot?.policyVersion !== POLICY_VERSION || snapshot?.radiusKm !== RADIUS_KM || snapshot?.limit !== LIMIT) return null;
  const entry = snapshot.spots?.[id];
  return canUseCache(entry, center, now) && (entry.selectionKey ?? 'latest') === selectionKey(selectedIds) ? entry : null;
}
