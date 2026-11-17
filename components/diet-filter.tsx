'use client';

import { useEffect, useState } from 'react';
import { allDishes } from '../content/menu';
import { DIET_FILTERS, matchesDiet, type DietFilter } from '../lib/menu-filter';
import { useScope } from './region-scope';

/**
 * Vegetarian and vegan filters for the menu. A progressive enhancement: the buttons only appear with
 * JavaScript, and the full menu is always in the static HTML.
 */
export function DietFilterBar() {
  const scope = useScope();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready || !scope) return null;

  const choose = (diet: DietFilter | '') => scope.setDiet(scope.diet === diet ? '' : diet);
  const count = allDishes.filter(dish => matchesDiet(dish, scope.diet)).length;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Dietary filters">
      <span className="kicker mr-1">Show</span>
      <button type="button" className="button button-ghost button-small aria-pressed:bg-ink aria-pressed:text-bg" aria-pressed={!scope.diet} onClick={() => scope.setDiet('')}>
        Everything
      </button>
      {DIET_FILTERS.map(filter => (
        <button key={filter.id} type="button" className="button button-ghost button-small aria-pressed:bg-ink aria-pressed:text-bg"
          aria-pressed={scope.diet === filter.id} onClick={() => choose(filter.id)}>
          {filter.label}
        </button>
      ))}
      <span className="sr-only" role="status" aria-live="polite">{scope.diet ? `${count} dishes match.` : ''}</span>
    </div>
  );
}
