import type { Metadata } from 'next';
import { CourseArt } from '../../components/course-art';
import { PageHead } from '../../components/page-head';
import { RegionIndex } from '../../components/region-index';
import { RegionMap } from '../../components/region-map';
import { RegionScope } from '../../components/region-scope';
import { SiteLink } from '../../components/site-link';
import { formatPrice } from '../../content/menu';
import { trattoria } from '../../content/trattoria';
import { houseWines, WINE_STYLES, wineList, winesByStyle, type Wine } from '../../content/wine';
import { dishesForWine } from '../../lib/pairings';
import { absoluteUrl } from '../../lib/paths';
import { region } from '../../lib/regions';

export const metadata: Metadata = {
  title: 'Wine list',
  description: `A short, honest list of Italian wines at ${trattoria.name}, by the glass and the bottle, mapped across Italy’s regions with the dishes they go with.`,
  alternates: { canonical: absoluteUrl('/wine/') },
};

function WineEntry({ wine }: { wine: Wine }) {
  const dishes = dishesForWine(wine.id);
  return (
    <li id={wine.id} data-region-entry={wine.region} className=" border-t border-line py-4">
      <div className="flex items-baseline gap-3">
        <h3 className="entry-name text-[clamp(1.35rem,2.4vw,1.7rem)] italic transition-colors">{wine.name}</h3>
        <span className="leader" aria-hidden="true" />
        <p className="figures flex flex-none gap-4 font-semibold">
          <span className="w-12 text-right"><span className="sr-only">Glass </span>{formatPrice(wine.glass)}</span>
          <span className="w-12 text-right"><span className="sr-only">Bottle </span>{formatPrice(wine.bottle)}</span>
        </p>
      </div>
      <p className="kicker mt-1">
        {wine.grape} · {region(wine.region).name}{wine.denomination ? ` · ${wine.denomination}` : ''}
      </p>
      <p className="mt-1.5 max-w-2xl font-display text-[1.04rem]">{wine.notes}</p>
      {dishes.length ? (
        <p className="mt-1.5 text-[.9rem] text-muted">
          With{' '}
          {dishes.map((dish, index) => (
            <span key={dish.id}>{index ? (index === dishes.length - 1 ? ' and ' : ', ') : ''}<SiteLink href={`/menu/#${dish.id}`} className="font-display text-wine italic underline decoration-1 underline-offset-[.2em]">{dish.name}</SiteLink></span>
          ))}
        </p>
      ) : null}
    </li>
  );
}

function PriceHeads() {
  return (
    <p className="kicker flex justify-end gap-4" aria-hidden="true">
      <span className="w-12 text-right">Glass</span><span className="w-12 text-right">Bottle</span>
    </p>
  );
}

export default function WinePage() {
  return (
    <RegionScope>
      <PageHead kicker="La cantina · the wine list" title={<>A short, honest <em>wine list</em></>}
        aside={<div className="flex items-end gap-1"><CourseArt art="wine-bottle" size={120} /><CourseArt art="wine-glass" size={96} /></div>}>
        <p>
          Wines from small growers in the regions our recipes come from, every one by the glass. If you can’t decide,
          each dish on the menu suggests one.
        </p>
      </PageHead>

      <div className="wrap">
        <p className="kicker mb-3">Where the cellar comes from</p>
        <RegionMap shade="wine" caption="Fig. C — The regions of Italy. Shaded: the ones on this wine list." />
        <RegionIndex shade="wine" />
      </div>

      <div className="wrap mt-(--space-section) grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <section id="della-casa" className=" lg:col-span-12" aria-labelledby="house-title">
          <div className="grid gap-x-12 gap-y-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="chapter-numeral">Della casa</p>
              <h2 id="house-title" className="mt-1 text-[clamp(2.6rem,6vw,4.4rem)] italic">By the glass</h2>
              <p className="prose-serif mt-3 text-muted">{wineList.houseNote}</p>
            </div>
            <div className="lg:col-span-8">
              <PriceHeads />
              <ul>{houseWines.map(wine => <WineEntry key={wine.id} wine={wine} />)}</ul>
            </div>
          </div>
        </section>

        {WINE_STYLES.map(style => {
          const list = winesByStyle(style.id);
          if (!list.length) return null;
          return (
            <section key={style.id} id={style.id} className=" lg:col-span-12" aria-labelledby={`${style.id}-title`}>
              <div className="grid gap-x-12 gap-y-3 lg:grid-cols-12">
                <div className="flex items-baseline justify-between gap-4 border-b-2 border-double border-rule pb-2 lg:col-span-4 lg:block lg:border-b-0 lg:pb-0">
                  <h2 id={`${style.id}-title`} className="text-[clamp(2.4rem,5vw,3.8rem)] italic">{style.title}</h2>
                  <p className="kicker lg:mt-2">{style.subtitle}</p>
                </div>
                <div className="lg:col-span-8">
                  <PriceHeads />
                  <ul>{list.map(wine => <WineEntry key={wine.id} wine={wine} />)}</ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="wrap mt-(--space-section) border-t border-rule pt-5 text-[.95rem] text-muted">
        {wineList.notes.map(note => <p key={note}>{note}</p>)}
        <p className="mt-2">Please drink responsibly. We serve alcohol only to guests 21 and over, with ID.</p>
      </div>
    </RegionScope>
  );
}
