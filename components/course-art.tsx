import type { ReactNode } from 'react';
import type { CourseArt as CourseArtName } from '../content/menu';

export type ArtName = CourseArtName | 'moka' | 'wine-glass' | 'wine-bottle';

/**
 * Small ink drawings for chapter heads and the wine list, in the same hand as the pasta plates.
 * Decorative: the headings beside them carry the meaning.
 */
export function CourseArt({ art, size = 96, className = '' }: { art: ArtName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {DRAWINGS[art]}
    </svg>
  );
}

const DRAWINGS: Record<ArtName, ReactNode> = {
  olives: (
    <>
      <path className="wash-olive" d="M14 56 C20 40 80 38 88 54 C90 70 70 84 50 84 C30 84 12 72 14 56 Z" />
      <path className="ink" d="M12 54 H88 C86 72 70 84 50 84 C30 84 14 72 12 54 Z M36 84 C36 88 64 88 64 84" />
      <path className="ink-fine" d="M20 62 C30 70 70 70 80 62" />
      {[[30, 46, -20], [44, 42, 10], [58, 45, -6], [70, 47, 24], [38, 51, 30], [53, 52, -30], [64, 52, 6]].map(([x, y, a]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${a})`}>
          <ellipse className="wash-olive" rx="6" ry="4.2" />
          <path className="ink" d="M-6 0a6 4.2 0 1 0 12 0a6 4.2 0 1 0 -12 0" />
          <path className="ink-fine" d="M-2 -2 c1 -1 3 -1 4 0" />
        </g>
      ))}
      <path className="ink" d="M66 40 C70 30 76 24 84 20 M78 26 l6 -2" />
    </>
  ),
  'pasta-nest': (
    <>
      <path className="wash-ochre" d="M18 56 C20 36 80 34 84 54 C86 72 66 80 50 80 C32 80 16 72 18 56 Z" />
      {[0, 30, 64, 100, 136].map((angle, i) => (
        <path key={angle} className={i % 2 ? 'ink-fine' : 'ink'} d="M18 58a32 16 0 1 0 64 0a32 16 0 1 0 -64 0" transform={`rotate(${angle} 50 58)`} />
      ))}
      <path className="ink" d="M76 70 C82 76 86 82 92 84 M72 74 C78 80 80 86 86 90" />
    </>
  ),
  roast: (
    <>
      <path className="wash-terracotta" d="M22 50 C26 30 74 28 80 46 C84 62 70 70 50 70 C32 70 20 62 22 50 Z" />
      <path className="ink" d="M8 70 a42 12 0 1 0 84 0 a42 12 0 1 0 -84 0 M14 70 a36 8 0 1 0 72 0" />
      <path className="ink" d="M22 62 C18 44 34 30 52 30 C70 30 84 42 80 58 C78 66 66 70 50 70 C36 70 24 68 22 62 Z" />
      <path className="ink-fine" d="M34 38 C40 50 40 60 36 68 M50 32 C56 46 56 58 52 70 M66 36 C72 48 72 58 68 68" />
      <path className="ink" d="M78 48 C84 44 90 46 92 40 M90 40 c2 -3 0 -6 -3 -5" />
      <path className="ink-fine" d="M26 76 c4 2 8 2 12 0 M60 78 c4 2 8 2 12 0 M14 66 c-2 -6 2 -10 6 -10" />
      <path className="ink" d="M20 66 c2 -8 -2 -12 2 -18 M22 52 l-4 -3 M21 58 l4 -3" />
    </>
  ),
  artichoke: (
    <>
      <path className="wash-olive" d="M30 60 C26 40 40 22 50 18 C60 22 74 40 70 60 C66 74 58 80 50 80 C42 80 34 74 30 60 Z" />
      <path className="ink" d="M50 18 C60 22 74 40 70 60 C66 74 58 80 50 80 C42 80 34 74 30 60 C26 40 40 22 50 18 Z" />
      <path className="ink" d="M50 18 C44 30 44 44 50 52 C56 44 56 30 50 18 M34 46 C40 54 46 58 50 70 C54 58 60 54 66 46 M32 62 C40 66 46 72 50 80 C54 72 60 66 68 62" />
      <path className="ink" d="M50 80 C50 86 52 90 56 94" />
      <path className="ink-fine" d="M40 34 C44 40 46 46 46 52 M60 34 C56 40 54 46 54 52" />
    </>
  ),
  'lemon-tart': (
    <>
      <path className="wash-ochre" d="M14 56 a36 12 0 1 0 72 0 a36 12 0 1 0 -72 0" />
      <path className="ink" d="M12 56 a38 13 0 1 0 76 0 a38 13 0 1 0 -76 0 M12 56 V64 a38 13 0 0 0 76 0 V56" />
      <path className="ink-fine" d="M18 60 v6 M26 64 v6 M36 66 v6 M48 67 v6 M60 66 v6 M70 64 v6 M80 60 v6" />
      <path className="ink" d="M20 55 a30 9 0 1 0 60 0 a30 9 0 1 0 -60 0" />
      <path className="ink" d="M56 30 C64 24 76 26 80 34 C78 42 66 44 58 38 C56 36 55 33 56 30 Z" />
      <path className="wash-ochre" d="M56 30 C64 24 76 26 80 34 C78 42 66 44 58 38 C56 36 55 33 56 30 Z" />
      <path className="ink-fine" d="M60 33 C66 31 72 32 76 35" />
      <path className="ink" d="M44 42 C44 36 50 32 54 34 M40 50 c4 -2 8 -2 12 0" />
    </>
  ),
  moka: (
    <>
      <path className="wash-terracotta" d="M30 36 C34 26 66 26 70 36 C76 56 72 80 50 82 C28 80 24 56 30 36 Z" />
      <path className="ink" d="M34 84 L38 56 H62 L66 84 Z M38 56 L36 50 H64 L62 56 M36 50 L40 22 H60 L64 50 M40 22 L46 16 H54 L60 22" />
      <path className="ink" d="M48 16 v-4 h4 v4 M64 30 C74 30 78 40 72 48 C70 50 66 50 64 48" />
      <path className="ink" d="M40 22 L32 28 L38 30" />
      <path className="ink-fine" d="M42 60 L40 80 M50 60 V82 M58 60 L60 80 M44 28 L42 46 M56 28 L58 46" />
    </>
  ),
  'wine-glass': (
    <>
      <path className="wash-terracotta" d="M32 26 C30 48 38 60 50 62 C62 60 70 48 68 26 Z" />
      <path className="art-wine" d="M34 42 C36 54 42 60 50 61 C58 60 64 54 66 42 Z" />
      <path className="ink" d="M32 22 C30 48 38 60 50 62 C62 60 70 48 68 22 Z M50 62 V86 M36 88 a14 3 0 0 0 28 0 a14 3 0 0 0 -28 0" />
      <path className="ink-fine" d="M38 28 C37 38 39 46 42 52" />
    </>
  ),
  'wine-bottle': (
    <>
      <path className="wash-olive" d="M38 40 C38 32 44 30 46 26 V10 H54 V26 C56 30 62 32 62 40 V90 H38 Z" />
      <path className="ink" d="M38 40 C38 32 44 30 46 26 V10 H54 V26 C56 30 62 32 62 40 V90 H38 Z M46 14 H54" />
      <path className="art-paper" d="M40 52 H60 V74 H40 Z" />
      <path className="ink" d="M40 52 H60 V74 H40 Z" />
      <path className="ink-fine" d="M44 58 H56 M44 63 H56 M46 68 H54 M41 36 C41 40 41 70 41 86" />
    </>
  ),
};
