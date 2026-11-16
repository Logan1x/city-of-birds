import test from 'node:test';
import assert from 'node:assert/strict';
import { RADIUS_KM, LIMIT, POLICY_VERSION, parseCoordinates, distanceKm, observationSearchUrl, selectObservations, canUseCache, cachedObservations, selectionKey, MAX_CACHE_AGE_MS } from '../scripts/lib/observations.mjs';

const center = '24.6,73.68';
const photo = { id: 100, license_code: 'cc-by', url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/100/square.jpg', attribution: '(c) Example observer, CC BY', flags: [], hidden: false };
const record = (overrides = {}) => ({
  id: 1, location: center, observed_on: '2025-01-10', positional_accuracy: 20,
  quality_grade: 'research', captive: false, obscured: false,
  geoprivacy: null, taxon_geoprivacy: 'open', photos: [photo],
  user: { login: 'example_observer', name: 'Example observer' },
  taxon: { name: 'Example species', preferred_common_name: 'Example bird', ancestor_ids: [1, 3], threatened: false },
  ...overrides,
});

test('API and browse queries use exactly 1 km, all identification grades and reusable noncommercial photos', () => {
  assert.equal(RADIUS_KM, 1);
  assert.equal(LIMIT, 3);
  for (const api of [true, false]) {
    const url = new URL(observationSearchUrl(center, api));
    for (const [key, value] of Object.entries({ radius: '1', taxon_id: '3', lat: '24.6', lng: '73.68', captive: 'false', photos: 'true', geoprivacy: 'open', taxon_geoprivacy: 'open', order_by: 'observed_on', order: 'desc' })) assert.equal(url.searchParams.get(key), value);
    assert.equal(url.searchParams.has('quality_grade'), false);
    assert.equal(url.searchParams.get('photo_license'), 'cc0,cc-by,cc-by-sa,cc-by-nc,cc-by-nc-sa');
  }
});

test('validates centres and locally enforces radius, including its boundary', () => {
  for (const bad of [undefined, '', '24.6,', 'NaN,73', '91,73', '24,181', '24,73,3']) assert.equal(parseCoordinates(bad), null);
  assert.throws(() => observationSearchUrl('bad'));
  const latOffset = km => km / 6371 * 180 / Math.PI;
  const nearby = `${24.6 + latOffset(0.999)},73.68`;
  const outside = `${24.6 + latOffset(1.001)},73.68`;
  assert.ok(distanceKm(parseCoordinates(center), parseCoordinates(nearby)) < 1);
  assert.equal(selectObservations([record({ location: nearby })], center).length, 1);
  assert.equal(selectObservations([record({ location: outside })], center).length, 0);
});

test('selects newest three unique observations, without requiring three different species', () => {
  const records = [1, 5, 2, 4, 3, 5].map(id => record({ id, observed_on: `2025-01-0${id}` }));
  const selected = selectObservations(records, center);
  assert.deepEqual(selected.map(item => item.id), [5, 4, 3]);
  assert.equal(selected[0].observer, 'Example observer');
  assert.equal(selected[0].url, 'https://www.inaturalist.org/observations/5');
  assert.equal(selected[0].photo.sourceUrl, 'https://inaturalist-open-data.s3.amazonaws.com/photos/100/small.jpg');
  assert.equal(selected[0].photo.licenseUrl, 'https://creativecommons.org/licenses/by/4.0/');
  assert.equal('location' in selected[0], false, 'do not persist observation coordinates');
});

test('excludes captive, non-bird, sensitive, obscured, inaccurate and invalid records', () => {
  const excluded = [
    { captive: true }, { captive: undefined }, { quality_grade: 'unknown' },
    { obscured: true }, { geoprivacy: 'private' }, { geoprivacy: 'obscured' }, { taxon_geoprivacy: 'obscured' },
    { taxon: { name: 'Plant', ancestor_ids: [1, 47126] } },
    { taxon: { name: 'Sensitive bird', ancestor_ids: [1, 3], threatened: true } },
    { location: null }, { location: '0,0' }, { positional_accuracy: 1001 },
    { observed_on: '2025-02-30' }, { observed_on: '2999-01-01' }, { id: -1 },
    { user: { login: 'spam', spam: true } },
  ];
  for (const overrides of excluded) assert.equal(selectObservations([record(overrides)], center).length, 0, JSON.stringify(overrides));
});

test('uses only an actual observation photo with attribution and a supported reuse licence', () => {
  for (const changes of [{ license_code: null }, { license_code: 'cc-by-nd' }, { license_code: 'cc-by-nc-nd' }, { hidden: true }, { flags: [{}] }, { attribution: '' }, { url: 'https://example.com/photos/100/square.jpg' }, { url: 'http://static.inaturalist.org/photos/100/square.jpg' }, { url: 'https://static.inaturalist.org/photos/200/square.jpg' }]) {
    assert.equal(selectObservations([record({ photos: [{ ...photo, ...changes }] })], center).length, 0);
  }
  assert.equal(selectObservations([record({ photos: [], taxon: { name: 'Bird', ancestor_ids: [3], default_photo: photo } })], center).length, 0);
  assert.equal(selectObservations([record({ photos: [{ ...photo, license_code: null }, photo] })], center).length, 1);
});

test('accepts Needs ID and casual birds, preserving their status instead of labelling them research grade', () => {
  for (const quality_grade of ['research', 'needs_id', 'casual']) {
    const selected = selectObservations([record({ quality_grade })], center);
    assert.equal(selected.length, 1);
    assert.equal(selected[0].qualityGrade, quality_grade);
  }
});

test('accepts noncommercial CC photos and keeps their correct attribution and share-alike licence', () => {
  for (const [code, name, path] of [['cc-by-nc', 'CC BY-NC 4.0', 'by-nc'], ['cc-by-nc-sa', 'CC BY-NC-SA 4.0', 'by-nc-sa']]) {
    const selected = selectObservations([record({ photos: [{ ...photo, license_code: code }] })], center);
    assert.equal(selected.length, 1);
    assert.equal(selected[0].photo.license, name);
    assert.equal(selected[0].photo.licenseUrl, `https://creativecommons.org/licenses/${path}/4.0/`);
    assert.equal(selected[0].photo.attribution, photo.attribution);
  }
});

test('member selections keep exact IDs and order instead of substituting newer records', () => {
  const results = [record({ id: 1 }), record({ id: 2 }), record({ id: 3 })];
  assert.deepEqual(selectObservations(results, center, LIMIT, { selectedIds: [3, 1, 2] }).map(item => item.id), [3, 1, 2]);
  assert.deepEqual(selectObservations(results, center, LIMIT, { selectedIds: [3, 4] }).map(item => item.id), [3]);
});

test('selected restricted photos are linked as text-only records, never copied or replaced by taxon photos', () => {
  const restricted = record({ photos: [{ ...photo, license_code: null }] });
  const [selected] = selectObservations([restricted], center, LIMIT, { selectedIds: [1] });
  assert.equal(selected.id, 1);
  assert.equal(selected.photo, null);
  assert.equal(selected.url, 'https://www.inaturalist.org/observations/1');
  assert.equal(JSON.stringify(selected).includes(photo.url), false);
  assert.equal(selectObservations([restricted], center).length, 0);
});

test('curation does not bypass privacy, wild-bird or one-kilometre checks', () => {
  for (const changes of [{ obscured: true }, { captive: true }, { location: '0,0' }]) {
    assert.deepEqual(selectObservations([record(changes)], center, LIMIT, { selectedIds: [1] }), []);
  }
});

test('explicit selections can be shown without inventing a search centre, but automatic selection cannot', () => {
  assert.equal(selectObservations([record()], null).length, 0);
  assert.equal(selectObservations([record()], null, LIMIT, { selectedIds: [1] }).length, 1);
  assert.equal(selectObservations([record({ obscured: true })], null, LIMIT, { selectedIds: [1] }).length, 0);
  assert.equal(selectObservations([record({ captive: true })], null, LIMIT, { selectedIds: [1] }).length, 0);
  assert.equal(selectObservations([record({ location: null })], null, LIMIT, { selectedIds: [1] }).length, 0);
});

test('shows partial/empty results, never widens the radius to fill slots', () => {
  assert.equal(selectObservations([record()], center).length, 1);
  assert.deepEqual(selectObservations([], center), []);
  assert.deepEqual(selectObservations(null, center), []);
  assert.deepEqual(selectObservations([record()], undefined), []);
});

test('cache requires the same centre, a successful state and a snapshot no older than seven days', () => {
  const now = Date.parse('2026-01-10T00:00:00Z');
  const entry = { center, status: 'ready', fetchedAt: new Date(now - 1000).toISOString(), observations: [] };
  assert.equal(canUseCache(entry, center, now), true);
  assert.equal(canUseCache({ ...entry, status: 'cached' }, center, now), true);
  assert.equal(canUseCache(entry, '24.61,73.68', now), false);
  assert.equal(canUseCache({ ...entry, status: 'unavailable' }, center, now), false);
  assert.equal(canUseCache({ ...entry, fetchedAt: new Date(now - MAX_CACHE_AGE_MS - 1).toISOString() }, center, now), false);
  assert.equal(canUseCache({ ...entry, fetchedAt: new Date(now + 1000).toISOString() }, center, now), false);
});

test('does not reuse a snapshot from a different filtering policy, radius or limit', () => {
  const now = Date.now();
  const entry = { center, status: 'ready', fetchedAt: new Date(now).toISOString(), observations: [] };
  const snapshot = { policyVersion: POLICY_VERSION, radiusKm: RADIUS_KM, limit: LIMIT, spots: { example: entry } };
  assert.equal(cachedObservations(snapshot, 'example', center, now), entry);
  for (const changes of [{ policyVersion: undefined }, { policyVersion: POLICY_VERSION - 1 }, { radiusKm: 2 }, { limit: 6 }]) {
    assert.equal(cachedObservations({ ...snapshot, ...changes }, 'example', center, now), null);
  }
  assert.equal(cachedObservations(snapshot, 'missing', center, now), null);
  assert.equal(cachedObservations(snapshot, 'example', center, now, [1, 2, 3]), null);
  const curated = { ...entry, selectionKey: selectionKey([1, 2, 3]) };
  const curatedSnapshot = { ...snapshot, spots: { example: curated } };
  assert.equal(cachedObservations(curatedSnapshot, 'example', center, now, [1, 2, 3]), curated);
  assert.equal(cachedObservations(curatedSnapshot, 'example', center, now, [3, 2, 1]), null);
  assert.equal(cachedObservations(curatedSnapshot, 'example', center, now), null);
});
