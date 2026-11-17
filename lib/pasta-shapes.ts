// The pasta atlas: a fixed set of fine line drawings, one per pasta shape, styled like plates in an
// old cookery book. Dishes name a `shape`; components/pasta-plate.tsx draws it, so a new dish needs no
// image. Every drawing sits in a 120 × 120 box. A new shape is a new entry here (plus its name in
// PASTA_SHAPES); tests check that every shape renders.

export const PASTA_SHAPES = [
  'tagliatelle', 'pappardelle', 'spaghetti', 'bucatini', 'rigatoni', 'penne', 'orecchiette', 'ravioli',
  'tortellini', 'gnocchi', 'lasagne', 'trofie', 'farfalle',
] as const;

export type PastaShape = (typeof PASTA_SHAPES)[number];

/** Watercolour tone behind a drawing, coloured by CSS tokens. */
export type Wash = 'terracotta' | 'olive' | 'ochre';

export interface PlateStroke {
  /** SVG path data, drawn as a fine ink line. */
  d: string;
  /** Optional SVG transform for repeated pieces. */
  transform?: string;
  /** A finer, lighter line for texture (ridges, flour, shading). */
  fine?: boolean;
}

export interface PastaPlate {
  shape: PastaShape;
  /** Display name for the caption, e.g. "Orecchiette". */
  name: string;
  /** "little ears": the name's plain-English meaning, shown in captions where there is room. */
  meaning: string;
  wash: Wash;
  /** Soft, irregular wash behind the drawing. */
  washPath: string;
  strokes: PlateStroke[];
}

const r = (n: number) => Math.round(n * 10) / 10;

/** A closed, slightly irregular blob, for the watercolour wash. Deterministic, so builds are stable. */
function blob(cx: number, cy: number, radius: number, seed: number): string {
  const points = 11;
  const coords = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const wobble = 1 + 0.09 * Math.sin(seed * 3.1 + i * 2.3) + 0.05 * Math.cos(seed * 1.7 + i * 4.1);
    return [cx + Math.cos(angle) * radius * wobble, cy + Math.sin(angle) * radius * 0.86 * wobble];
  });
  // Catmull-Rom through the points, as cubic Béziers.
  let d = `M${r(coords[0][0])} ${r(coords[0][1])}`;
  for (let i = 0; i < points; i++) {
    const p0 = coords[(i - 1 + points) % points], p1 = coords[i], p2 = coords[(i + 1) % points], p3 = coords[(i + 2) % points];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
  }
  return `${d}Z`;
}

/** Ellipse as a path, centred on (cx, cy). */
function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${r(cx - rx)} ${r(cy)}a${rx} ${ry} 0 1 0 ${r(rx * 2)} 0a${rx} ${ry} 0 1 0 ${r(-rx * 2)} 0`;
}

/** A wavy line from x0 to x1 at height y: `waves` full waves of the given amplitude. */
function wavy(x0: number, x1: number, y: number, waves: number, amplitude: number): string {
  const step = (x1 - x0) / (waves * 2);
  let d = `M${r(x0)} ${r(y)}`;
  for (let i = 0; i < waves * 2; i++) {
    const sign = i % 2 === 0 ? -1 : 1;
    d += ` Q${r(x0 + step * (i + 0.5))} ${r(y + sign * amplitude)} ${r(x0 + step * (i + 1))} ${r(y)}`;
  }
  return d;
}

/** A crimped (pinked) edge around a square of side `size`, centred on the origin. */
function crimpedSquare(size: number, teeth: number, depth: number): string {
  const h = size / 2;
  const corners = [[-h, -h], [h, -h], [h, h], [-h, h]];
  let d = '';
  corners.forEach(([x0, y0], side) => {
    const [x1, y1] = corners[(side + 1) % 4];
    for (let i = 0; i < teeth; i++) {
      const t0 = i / teeth, tm = (i + 0.5) / teeth;
      const px = x0 + (x1 - x0) * t0, py = y0 + (y1 - y0) * t0;
      // Outward normal of this side.
      const nx = side === 1 ? 1 : side === 3 ? -1 : 0, ny = side === 0 ? -1 : side === 2 ? 1 : 0;
      const mx = x0 + (x1 - x0) * tm + nx * depth, my = y0 + (y1 - y0) * tm + ny * depth;
      d += `${d ? ' L' : 'M'}${r(px)} ${r(py)} L${r(mx)} ${r(my)}`;
    }
  });
  return `${d}Z`;
}

const at = (x: number, y: number, rotate = 0, scale = 1) =>
  `translate(${x} ${y})${rotate ? ` rotate(${rotate})` : ''}${scale !== 1 ? ` scale(${scale})` : ''}`;

function spaghetti(): PlateStroke[] {
  const strands = Array.from({ length: 9 }, (_, i) => {
    const k = i - 4;
    return { d: `M${r(22 + k * 1.6)} ${r(98 + k * 2.4)} L${r(98 + k * 2.6)} ${r(22 + k * 1.4)}` };
  });
  return [
    ...strands,
    { d: 'M26 106 C44 96 36 76 58 70 S88 78 104 56', fine: false },
    { d: 'M40 84 l10 10 M45 79 l10 10', fine: true },
  ];
}

function bucatini(): PlateStroke[] {
  const strokes: PlateStroke[] = [];
  [0, 1, 2, 3, 4].forEach(k => {
    const y = 40 + k * 9;
    const x0 = 14 + (k % 2) * 6, x1 = 102 - (k % 3) * 4;
    strokes.push(
      { d: `M${x0} ${y} L${x1} ${y} M${x0} ${y + 5} L${x1} ${y + 5}`, transform: 'rotate(-28 60 60)' },
      { d: ellipse(x1, y + 2.5, 1.6, 2.5), transform: 'rotate(-28 60 60)' },
      { d: ellipse(x1, y + 2.5, 0.5, 0.8), transform: 'rotate(-28 60 60)', fine: true },
    );
  });
  return strokes;
}

function tagliatelle(): PlateStroke[] {
  const strokes: PlateStroke[] = [0, 28, 61, 96, 128, 157].flatMap((angle, i) => [
    { d: ellipse(60, 62, 36 - (i % 3) * 3, 22 - (i % 2) * 3), transform: `rotate(${angle} 60 62)` },
    { d: ellipse(60, 62, 32 - (i % 3) * 3, 18 - (i % 2) * 3), transform: `rotate(${angle} 60 62)`, fine: true },
  ]);
  strokes.push(
    { d: 'M88 80 C98 88 100 98 108 104 M91 77 C101 85 104 95 112 100' },
    { d: 'M30 100 l3 1 M36 104 l2 2 M24 96 l2 0', fine: true },
  );
  return strokes;
}

function pappardelle(): PlateStroke[] {
  return [26, 52, 78].flatMap((y, i) => {
    const t = `rotate(${-8 + i * 6} 60 ${y})`;
    return [
      { d: `M14 ${y} C40 ${y - 14} 70 ${y + 14} 106 ${y - 4}`, transform: t },
      { d: `M14 ${y + 12} C40 ${y - 2} 70 ${y + 26} 106 ${y + 8}`, transform: t },
      { d: `M14 ${y} l-2 3 l3 3 l-2 3 l2 3 M106 ${y - 4} l2 3 l-3 3 l2 3 l-2 3`, transform: t },
      { d: `M20 ${y + 7} C44 ${y - 6} 70 ${y + 20} 100 ${y + 3}`, transform: t, fine: true },
    ];
  });
}

function rigatoni(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: ellipse(0, 0, 7, 10) },
    { d: ellipse(0, 0, 4.4, 7), fine: true },
    { d: 'M0 -10 L34 -10 A7 10 0 0 1 34 10 L0 10' },
    { d: 'M4 -6 L34 -6 M4 -2 L35 -2 M4 2 L35 2 M4 6 L34 6', fine: true },
  ];
  return [at(30, 34, -14), at(46, 64, 9), at(26, 92, -4)].flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

function penne(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: 'M-18 -5 L12 -5 L18 5 L-12 5 Z' },
    { d: 'M-18 -5 L-12 5', fine: true },
    { d: 'M-12 -2 L14 -2 M-10 1 L16 1 M-8 3.5 L16 3.5', fine: true },
  ];
  return [at(40, 34, -24), at(76, 46, 18), at(44, 74, 8), at(80, 88, -30)].flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

function orecchiette(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: 'M-12 1 C-12 -8 -4 -12 2 -11 C9 -10 13 -4 12 2 C11 9 4 12 -2 11 C-8 10 -12 7 -12 1 Z' },
    { d: ellipse(0.5, 0.5, 7, 5.5) },
    { d: 'M-4 -1 C-2 -3 2 -3 4 -1', fine: true },
    { d: 'M-10 6 C-7 9 -3 10 1 10', fine: true },
  ];
  return [at(34, 36, 10), at(72, 30, -20), at(56, 62, 30), at(26, 80, -8, 0.9), at(88, 76, 14, 1.1)]
    .flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

function ravioli(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: crimpedSquare(30, 6, 1.8) },
    { d: 'M-11 -11 H11 V11 H-11 Z', fine: true },
    { d: ellipse(0, 0, 8, 7.5) },
    { d: 'M-4 -4 C-2 -6 2 -6 4 -4', fine: true },
  ];
  return [at(38, 38, -6), at(80, 40, 8), at(36, 82, 10), at(80, 82, -4)].flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

function tortellini(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: 'M-12 2 C-12 -7 -6 -12 0 -12 C7 -12 12 -7 12 1 C12 6 9 9 5 10 L2 7 C5 6 6 3 6 0 C6 -4 3 -6 0 -6 C-3 -6 -6 -4 -6 0 C-6 3 -5 6 -2 7 L-5 10 C-9 9 -12 6 -12 2 Z' },
    { d: 'M-5 10 C-3 13 3 13 5 10', },
    { d: 'M-9 -2 C-8 -7 -3 -9 1 -9', fine: true },
  ];
  return [at(34, 34, -10), at(76, 34, 16), at(56, 64, 0), at(30, 88, 24), at(84, 86, -18)]
    .flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

function gnocchi(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: ellipse(0, 0, 10, 7) },
    { d: 'M-5 -6 C-7 -2 -7 2 -5 6 M-1 -7 C-3 -2 -3 2 -1 7 M3 -7 C1 -2 1 2 3 7 M7 -5 C5 -2 5 2 7 5', fine: true },
  ];
  return [at(32, 34, 20), at(62, 30, -10), at(90, 40, 30), at(40, 64, -25), at(74, 66, 12), at(52, 92, 40), at(86, 92, -15)]
    .flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

function lasagne(): PlateStroke[] {
  return [[18, 26], [24, 50], [14, 74]].flatMap(([x, y], i) => {
    const t = `rotate(${[-4, 3, -2][i]} 60 ${y + 12})`;
    return [
      { d: `${wavy(x, x + 82, y, 6, 2.6)} L${x + 82} ${y + 22} ${wavy(x + 82, x, y + 22, 6, 2.6).replace(/^M[\d. ]+/, '')} Z`, transform: t },
      { d: `M${x + 6} ${y + 8} H${x + 76} M${x + 6} ${y + 14} H${x + 76}`, transform: t, fine: true },
    ];
  });
}

function trofie(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: 'M-12 -1 C-8 -6 -3 1 2 -3 C6 -6 10 -4 12 0 C10 3 6 2 2 4 C-3 6 -8 4 -12 2 Z' },
    { d: 'M-7 -3 L-5 4 M-2 -1 L0 5 M3 -4 L5 3 M8 -4 L9 2', fine: true },
  ];
  return [at(32, 32, 30), at(70, 28, -15), at(92, 52, 60), at(44, 58, -35), at(76, 76, 20), at(36, 88, 5), at(92, 94, -40)]
    .flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

function farfalle(): PlateStroke[] {
  const piece: PlateStroke[] = [
    { d: 'M-3 -2 L-17 -11 L-19 -7 L-17 -3 L-19 1 L-17 5 L-19 9 L-17 11 L-3 2 M3 -2 L17 -11 L19 -7 L17 -3 L19 1 L17 5 L19 9 L17 11 L3 2' },
    { d: ellipse(0, 0, 3.4, 4.2) },
    { d: 'M-12 -6 C-9 -2 -9 2 -12 6 M12 -6 C9 -2 9 2 12 6', fine: true },
  ];
  return [at(36, 36, -12), at(82, 40, 14), at(40, 82, 20), at(84, 84, -8)].flatMap(transform => piece.map(stroke => ({ ...stroke, transform })));
}

type Definition = { name: string; meaning: string; wash: Wash; draw: () => PlateStroke[] };

const DEFINITIONS: Record<PastaShape, Definition> = {
  tagliatelle: { name: 'Tagliatelle', meaning: 'little cut ribbons', wash: 'ochre', draw: tagliatelle },
  pappardelle: { name: 'Pappardelle', meaning: 'from pappare, to gobble up', wash: 'terracotta', draw: pappardelle },
  spaghetti: { name: 'Spaghetti', meaning: 'little strings', wash: 'ochre', draw: spaghetti },
  bucatini: { name: 'Bucatini', meaning: 'little holes', wash: 'terracotta', draw: bucatini },
  rigatoni: { name: 'Rigatoni', meaning: 'large ridged ones', wash: 'terracotta', draw: rigatoni },
  penne: { name: 'Penne', meaning: 'quills', wash: 'ochre', draw: penne },
  orecchiette: { name: 'Orecchiette', meaning: 'little ears', wash: 'olive', draw: orecchiette },
  ravioli: { name: 'Ravioli', meaning: 'little parcels', wash: 'ochre', draw: ravioli },
  tortellini: { name: 'Tortellini', meaning: 'little pies', wash: 'ochre', draw: tortellini },
  gnocchi: { name: 'Gnocchi', meaning: 'little knots', wash: 'olive', draw: gnocchi },
  lasagne: { name: 'Lasagne', meaning: 'wide sheets', wash: 'terracotta', draw: lasagne },
  trofie: { name: 'Trofie', meaning: 'little twists', wash: 'olive', draw: trofie },
  farfalle: { name: 'Farfalle', meaning: 'butterflies', wash: 'ochre', draw: farfalle },
};

export function isPastaShape(value: string): value is PastaShape {
  return (PASTA_SHAPES as readonly string[]).includes(value);
}

/** The drawing for a shape, or a clear error naming the unknown shape and the known ones. */
export function pastaPlate(shape: string): PastaPlate {
  if (!isPastaShape(shape)) {
    throw new Error(`Unknown pasta shape "${shape}". Use one of: ${PASTA_SHAPES.join(', ')}, or add a drawing in lib/pasta-shapes.ts.`);
  }
  const definition = DEFINITIONS[shape];
  return {
    shape,
    name: definition.name,
    meaning: definition.meaning,
    wash: definition.wash,
    washPath: blob(60, 62, 44, PASTA_SHAPES.indexOf(shape) + 1),
    strokes: definition.draw(),
  };
}
