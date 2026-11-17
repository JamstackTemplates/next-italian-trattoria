'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { regionIndex } from '../lib/pairings';
import { REGIONS, type RegionId } from '../lib/regions';
import { useScope } from './region-scope';
import { SiteLink } from './site-link';

const index = regionIndex();

/**
 * Italy as a tile map of its 20 regions, roughly in the shape of the peninsula and islands. Regions
 * the menu (or wine list) visits are shaded. With JavaScript, shaded tiles become buttons: choosing
 * one highlights its dishes and wines. Without it, the map is a static figure and the region index
 * beside it links to every dish.
 */
export function RegionMap({ shade, caption }: { shade: 'menu' | 'wine'; caption: string }) {
  const scope = useScope();
  const [local, setLocal] = useState<RegionId | null>(null);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);

  const selected = scope ? scope.region : local;
  const select = (id: RegionId | null) => (scope ? scope.setRegion(id) : setLocal(id));
  const visited = new Map(index.filter(entry => (shade === 'menu' ? entry.dishes.length : entry.wines.length) > 0).map(entry => [entry.id, entry]));
  const current = selected ? index.find(entry => entry.id === selected) : undefined;
  let order = 0;

  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] sm:items-start">
      <figure className="region-map">
        <div className="region-grid" style={{ gridTemplateRows: 'repeat(8, auto)' }}>
          {REGIONS.map(region => {
            const entry = visited.get(region.id);
            const style = { gridColumn: region.col + 1, gridRow: region.row + 1, '--i': entry ? order++ : 0 } as CSSProperties;
            const label = (
              <>
                <span className="region-tile-name">{region.short}</span>
                <span className="region-tile-code" aria-hidden="true">{region.short.slice(0, 3)}</span>
              </>
            );
            if (entry && interactive) {
              const count = shade === 'menu'
                ? `${entry.dishes.length} dish${entry.dishes.length === 1 ? '' : 'es'}`
                : `${entry.wines.length} wine${entry.wines.length === 1 ? '' : 's'}`;
              return (
                <button key={region.id} type="button" className="region-tile" data-visited="" style={style}
                  aria-pressed={selected === region.id} aria-label={`${region.name}: ${count}`} title={region.name}
                  onClick={() => select(selected === region.id ? null : region.id)}>
                  {label}
                </button>
              );
            }
            return (
              <span key={region.id} className="region-tile" data-visited={entry ? '' : undefined} style={style} title={region.name}>
                {label}
              </span>
            );
          })}
        </div>
        <figcaption className="figure-caption mt-3 border-t border-line pt-2">{caption}</figcaption>
      </figure>

      <div className="min-h-[8rem] border-l border-line pl-5 print:hidden" aria-live="polite">
        {current ? (
          <div>
            <p className="kicker">Selected region</p>
            <h3 className="mt-1 text-[1.9rem] italic">{current.name}</h3>
            {current.dishes.length ? (
              <>
                <p className="kicker mt-3">On the menu</p>
                <ul className="mt-1 grid gap-0.5 font-display text-[1.05rem] italic">
                  {current.dishes.map(dish => <li key={dish.id}><SiteLink className="text-link font-normal" href={`/menu/#${dish.id}`}>{dish.name}</SiteLink></li>)}
                </ul>
              </>
            ) : null}
            {current.wines.length ? (
              <>
                <p className="kicker mt-3">In the cellar</p>
                <ul className="mt-1 grid gap-0.5 font-display text-[1.05rem] italic">
                  {current.wines.map(wine => <li key={wine.id}><SiteLink className="font-normal text-wine underline decoration-1 underline-offset-[.2em]" href={`/wine/#${wine.id}`}>{wine.name}</SiteLink></li>)}
                </ul>
              </>
            ) : null}
            <button type="button" className="button button-ghost button-small mt-4" onClick={() => select(null)}>Show every region</button>
          </div>
        ) : (
          <p className="prose-serif text-muted italic">
            {interactive
              ? `Choose a shaded region to light up its ${shade === 'menu' ? 'dishes' : 'wines'}, and the ${shade === 'menu' ? 'wines' : 'dishes'} from the same hills.`
              : `Shaded regions are the ones this ${shade === 'menu' ? 'menu' : 'wine list'} visits. The index lists them with their ${shade === 'menu' ? 'dishes' : 'wines'}.`}
          </p>
        )}
      </div>
    </div>
  );
}
