import { BADGES, DIETS, figureNumber, formatPrice, type Dish } from '../content/menu';
import { wineForDish } from '../lib/pairings';
import { region } from '../lib/regions';
import { CourseArt, type ArtName } from './course-art';
import { PastaPlate } from './pasta-plate';
import { SiteLink } from './site-link';

/** Attributes the diet filters and region map act on. */
export function filterAttributes(dishes: Dish[]) {
  const veg = dishes.some(dish => dish.diet?.some(d => d === 'vegetarian' || d === 'vegan'));
  const vegan = dishes.some(dish => dish.diet?.includes('vegan'));
  return { 'data-filterable': '', 'data-veg': veg ? '' : undefined, 'data-vegan': vegan ? '' : undefined };
}

function Kicker({ dish }: { dish: Dish }) {
  return (
    <p className="kicker">
      {region(dish.region).name}
      {dish.badge ? <> · <span className="badge">{BADGES[dish.badge]}</span></> : null}
    </p>
  );
}

function Meta({ dish }: { dish: Dish }) {
  const wine = wineForDish(dish);
  if (!dish.diet?.length && !wine) return null;
  return (
    <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[.9rem]">
      {dish.diet?.length ? (
        <span className="inline-flex gap-1">
          {dish.diet.map(diet => <abbr key={diet} className="diet-mark" data-diet={diet} title={DIETS[diet].label}>{DIETS[diet].short}</abbr>)}
        </span>
      ) : null}
      {wine ? (
        <span className="text-muted">
          Pairs with <SiteLink href={`/wine/#${wine.id}`} className="font-display font-semibold text-wine italic underline decoration-1 underline-offset-[.2em]">{wine.name}</SiteLink>
        </span>
      ) : null}
    </p>
  );
}

function Price({ dish }: { dish: Dish }) {
  return dish.soldOut
    ? <span className="finito ml-1">Finito for today</span>
    : <span className="figures ml-1 font-sans text-[.95rem] font-semibold whitespace-nowrap">{formatPrice(dish.price)}</span>;
}

/**
 * A dish set as an editorial entry: region kicker, the Italian name in large italic, the English
 * description as a serif paragraph with the price in the text, diet marks and the wine pairing.
 * Pasta primi carry their plate from the atlas. No cards.
 */
export function DishEntry({ dish }: { dish: Dish }) {
  const figure = figureNumber(dish.id);
  return (
    <article id={dish.id} data-entry="" data-region-entry={dish.region} {...filterAttributes([dish])}
      className="flex gap-4 border-t border-line pt-4">
      {dish.shape ? <PastaPlate shape={dish.shape} figure={figure} size={96} className="w-24 flex-none max-xs:w-20" /> : null}
      <div className="min-w-0">
        <Kicker dish={dish} />
        <h3 className={`entry-name mt-1 text-[clamp(1.45rem,2.4vw,1.8rem)] italic transition-colors ${dish.soldOut ? 'text-muted line-through decoration-1' : ''}`}>{dish.name}</h3>
        <p className="mt-1.5 font-display text-[1.06rem] leading-normal">{dish.description} <Price dish={dish} /></p>
        <Meta dish={dish} />
      </div>
    </article>
  );
}

/** A featured dish: set large across the columns with bigger art and a pull quote. */
export function FeaturedDish({ dish, art }: { dish: Dish; art: ArtName }) {
  const figure = figureNumber(dish.id);
  return (
    <article id={dish.id} data-entry="" data-region-entry={dish.region} {...filterAttributes([dish])}
      className="grid gap-x-8 gap-y-5 border-t border-rule pt-6 md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)]">
      {dish.shape
        ? <PastaPlate shape={dish.shape} regionId={dish.region} figure={figure} size={176} className="w-44" />
        : <CourseArt art={art} size={150} className="max-md:hidden" />}
      <div>
        <Kicker dish={dish} />
        <h3 className={`entry-name mt-1 text-[clamp(2.1rem,4vw,3.1rem)] italic transition-colors ${dish.soldOut ? 'text-muted line-through decoration-1' : ''}`}>{dish.name}</h3>
        <p className="mt-2 font-display text-[1.2rem] leading-normal">{dish.description} <Price dish={dish} /></p>
        <Meta dish={dish} />
      </div>
      {dish.pullQuote ? <blockquote className="pull-quote self-center md:col-span-2 xl:col-span-1">{dish.pullQuote}</blockquote> : null}
    </article>
  );
}
