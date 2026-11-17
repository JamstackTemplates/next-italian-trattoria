import type { Dish } from '../content/menu';

/** Dietary filters on the menu page. Vegan dishes also count as vegetarian. */
export type DietFilter = 'vegetarian' | 'vegan';

export const DIET_FILTERS: { id: DietFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
];

export function matchesDiet(dish: Pick<Dish, 'diet'>, filter: DietFilter | ''): boolean {
  if (!filter) return true;
  const diet = dish.diet ?? [];
  return filter === 'vegan' ? diet.includes('vegan') : diet.includes('vegetarian') || diet.includes('vegan');
}
