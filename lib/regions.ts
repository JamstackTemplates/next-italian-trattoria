// Italy's 20 regions and their places on the stylised tile map (components/region-map.tsx).
// The tiles sit roughly where each region lies on the peninsula and islands; it is a diagram, not a
// traced map. Every dish and wine names one of these ids as its `region`.

export const REGION_IDS = [
  'valle-d-aosta', 'piemonte', 'liguria', 'lombardia', 'trentino-alto-adige', 'veneto', 'friuli-venezia-giulia',
  'emilia-romagna', 'toscana', 'umbria', 'marche', 'lazio', 'abruzzo', 'molise', 'campania', 'puglia',
  'basilicata', 'calabria', 'sicilia', 'sardegna',
] as const;

export type RegionId = (typeof REGION_IDS)[number];

export interface Region {
  id: RegionId;
  /** Italian name, as it appears in the kicker above a dish ("EMILIA-ROMAGNA"). */
  name: string;
  /** Short label for a small tile. */
  short: string;
  /** Tile column (0 = west) and row (0 = north) on the map grid. */
  col: number;
  row: number;
}

/** Grid size of the tile map. */
export const MAP_COLUMNS = 7;
export const MAP_ROWS = 8;

export const REGIONS: readonly Region[] = [
  { id: 'valle-d-aosta', name: 'Valle d’Aosta', short: 'Aosta', col: 0, row: 0 },
  { id: 'lombardia', name: 'Lombardia', short: 'Lomb.', col: 1, row: 0 },
  { id: 'trentino-alto-adige', name: 'Trentino-Alto Adige', short: 'Trent.', col: 2, row: 0 },
  { id: 'veneto', name: 'Veneto', short: 'Veneto', col: 3, row: 0 },
  { id: 'friuli-venezia-giulia', name: 'Friuli-Venezia Giulia', short: 'Friuli', col: 4, row: 0 },
  { id: 'piemonte', name: 'Piemonte', short: 'Piem.', col: 0, row: 1 },
  { id: 'liguria', name: 'Liguria', short: 'Liguria', col: 1, row: 1 },
  { id: 'emilia-romagna', name: 'Emilia-Romagna', short: 'Emilia', col: 2, row: 1 },
  { id: 'toscana', name: 'Toscana', short: 'Toscana', col: 2, row: 2 },
  { id: 'umbria', name: 'Umbria', short: 'Umbria', col: 3, row: 2 },
  { id: 'marche', name: 'Marche', short: 'Marche', col: 4, row: 2 },
  { id: 'lazio', name: 'Lazio', short: 'Lazio', col: 3, row: 3 },
  { id: 'abruzzo', name: 'Abruzzo', short: 'Abruzzo', col: 4, row: 3 },
  { id: 'sardegna', name: 'Sardegna', short: 'Sard.', col: 1, row: 4 },
  { id: 'campania', name: 'Campania', short: 'Camp.', col: 4, row: 4 },
  { id: 'molise', name: 'Molise', short: 'Molise', col: 5, row: 4 },
  { id: 'basilicata', name: 'Basilicata', short: 'Basil.', col: 5, row: 5 },
  { id: 'puglia', name: 'Puglia', short: 'Puglia', col: 6, row: 5 },
  { id: 'calabria', name: 'Calabria', short: 'Calab.', col: 5, row: 6 },
  { id: 'sicilia', name: 'Sicilia', short: 'Sicilia', col: 4, row: 7 },
];

const BY_ID = new Map(REGIONS.map(region => [region.id, region]));

export function isRegionId(value: string): value is RegionId {
  return BY_ID.has(value as RegionId);
}

/** The region for an id, or a clear error naming the bad id and the valid ones. */
export function region(id: string): Region {
  const found = BY_ID.get(id as RegionId);
  if (!found) throw new Error(`Unknown region "${id}". Use one of: ${REGION_IDS.join(', ')}.`);
  return found;
}

/** Region ids in tile-map order (north to south), keeping only those in `ids`. */
export function sortRegions(ids: Iterable<string>): RegionId[] {
  const wanted = new Set(ids);
  return [...REGIONS].sort((a, b) => a.row - b.row || a.col - b.col).filter(r => wanted.has(r.id)).map(r => r.id);
}
