// Links between the menu and the wine list, derived from the menu's `pairing` fields so nothing is
// typed twice, plus the regions each page visits (for the tile map).
import { allDishes, specials, type Dish } from '../content/menu.ts';
import { wines, type Wine } from '../content/wine.ts';
import { region, sortRegions, type RegionId } from './regions.ts';

/** Dishes that list this wine as their pairing, in menu order. */
export function dishesForWine(wineId: string): Dish[] {
  return allDishes.filter(dish => dish.pairing === wineId);
}

/** The wine a dish pairs with, if any. */
export function wineForDish(dish: Dish): Wine | undefined {
  return dish.pairing ? wines.find(wine => wine.id === dish.pairing) : undefined;
}

export interface RegionEntry {
  id: RegionId;
  name: string;
  dishes: Dish[];
  wines: Wine[];
}

/** Every region the menu (and specials) or wine list visits, north to south, with what comes from it. */
export function regionIndex(): RegionEntry[] {
  const ids = new Set<string>([
    ...allDishes.map(dish => dish.region),
    ...specials.flatMap(special => special.region ? [special.region] : []),
    ...wines.map(wine => wine.region),
  ]);
  return sortRegions(ids).map(id => ({
    id,
    name: region(id).name,
    dishes: allDishes.filter(dish => dish.region === id),
    wines: wines.filter(wine => wine.region === id),
  }));
}
