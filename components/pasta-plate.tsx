import { pastaPlate } from '../lib/pasta-shapes';
import { region } from '../lib/regions';

/**
 * One plate of the pasta atlas: the shape drawn in fine ink over a wash, with a hairline caption
 * such as "Fig. 3 — Orecchiette, Puglia". Drawn from the dish's `shape`, so no image files.
 */
export function PastaPlate({ shape, regionId, figure, size = 132, caption = true, className = '' }: {
  shape: string;
  /** Region id for the caption ("Fig. 3 — Orecchiette, Puglia"); omit when the region is shown nearby. */
  regionId?: string;
  /** Plate number for the caption; omit for an unnumbered plate. */
  figure?: number;
  size?: number;
  caption?: boolean;
  className?: string;
}) {
  const plate = pastaPlate(shape);
  const place = regionId ? region(regionId).name : '';
  const label = `${figure ? `Fig. ${figure} — ` : ''}${plate.name}${place ? `, ${place}` : ''}`;
  return (
    <figure className={`plate ${className}`}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`Drawing of ${plate.name.toLowerCase()} (${plate.meaning})`}>
        <path className={`plate-wash wash-${plate.wash}`} d={plate.washPath} />
        {plate.strokes.map((stroke, index) => (
          <path key={index} className={`plate-line ${stroke.fine ? 'ink-fine' : 'ink'}`} d={stroke.d} transform={stroke.transform} pathLength={1} />
        ))}
      </svg>
      {caption ? (
        <figcaption className="mt-2 border-t border-line pt-1.5 font-display text-[.82rem] leading-snug text-muted italic">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
