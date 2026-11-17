import { regionIndex } from '../lib/pairings';
import { SiteLink } from './site-link';

/**
 * The map's text version: every region this page visits, north to south, linking to its dishes or
 * wines. Always in the static HTML, so the map works as an index without JavaScript.
 */
export function RegionIndex({ shade }: { shade: 'menu' | 'wine' }) {
  const entries = regionIndex().filter(entry => (shade === 'menu' ? entry.dishes.length : entry.wines.length) > 0);
  return (
    <details className="faq mt-6 border-y border-line">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-3">
        <span className="kicker">Index of regions · {entries.length}</span>
      </summary>
      <ul className="columns-1 gap-8 pb-4 sm:columns-2 lg:columns-3">
        {entries.map(entry => (
          <li key={entry.id} className="mb-2 break-inside-avoid text-[.95rem]">
            <span className="caps text-[.7rem] text-muted">{entry.name}</span>
            <span className="block font-display italic">
              {(shade === 'menu' ? entry.dishes : entry.wines).map((item, i) => (
                <span key={item.id}>{i ? ' · ' : ''}<SiteLink className="no-underline hover:text-accent hover:underline" href={`/${shade}/#${item.id}`}>{item.name}</SiteLink></span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
