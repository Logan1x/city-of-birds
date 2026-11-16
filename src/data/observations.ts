import snapshot from './observations.json';
import selections from './observation-selections.json';
import { observationSearchUrl, RADIUS_KM, LIMIT, POLICY_VERSION, selectionKey } from '../../scripts/lib/observations.mjs';

export interface NearbyObservation {
  id: number;
  name: string;
  scientificName: string;
  observedOn: string;
  qualityGrade: 'research' | 'needs_id' | 'casual';
  observer: string;
  url: string;
  photo: { id: number; src: string; attribution: string; license: string; licenseUrl: string } | null;
}

interface ObservationEntry {
  center: string | null;
  selectionKey: string;
  status: 'ready' | 'cached' | 'unavailable';
  fetchedAt: string | null;
  observations: NearbyObservation[];
}

export function nearbyObservations(id: string, center?: string) {
  const selectedIds = (selections as Record<string, number[]>)[id] ?? [];
  if (!center && !selectedIds.length) return { status: 'missing-coordinates' as const, observations: [], searchUrl: undefined, curated: false };
  const entry = (snapshot.spots as Record<string, ObservationEntry>)[id];
  const valid = 'policyVersion' in snapshot && snapshot.policyVersion === POLICY_VERSION
    && snapshot.radiusKm === RADIUS_KM && snapshot.limit === LIMIT && entry?.center === (center ?? null)
    && entry.selectionKey === selectionKey(selectedIds);
  return {
    status: valid ? entry.status : 'unavailable' as const,
    observations: valid ? entry.observations.slice(0, LIMIT) : [],
    searchUrl: center ? observationSearchUrl(center) : undefined,
    curated: selectedIds.length > 0,
  };
}
