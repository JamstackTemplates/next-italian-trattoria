'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { DietFilter } from '../lib/menu-filter';
import type { RegionId } from '../lib/regions';

type Scope = {
  region: RegionId | null;
  setRegion: (region: RegionId | null) => void;
  diet: DietFilter | '';
  setDiet: (diet: DietFilter | '') => void;
};

const ScopeContext = createContext<Scope | null>(null);

export function useScope(): Scope | null {
  return useContext(ScopeContext);
}

/**
 * Wraps the menu or wine list so the region map and diet filters can act on it. Everything inside is
 * rendered in full in the static HTML; choosing a region fades entries from elsewhere, and a diet
 * filter hides non-matching dishes through CSS (`data-diet`, see tailwind.input.css).
 */
export function RegionScope({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [region, setRegion] = useState<RegionId | null>(null);
  const [diet, setDiet] = useState<DietFilter | ''>('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const entries = ref.current?.querySelectorAll<HTMLElement>('[data-region-entry]') ?? [];
    entries.forEach(entry => {
      if (!region) {
        delete entry.dataset.dim;
        delete entry.dataset.lit;
        return;
      }
      const match = entry.dataset.regionEntry === region;
      entry.dataset.dim = String(!match);
      entry.dataset.lit = String(match);
    });
  }, [region]);

  return (
    <ScopeContext.Provider value={{ region, setRegion, diet, setDiet }}>
      <div ref={ref} className={`menu-scope ${className}`} data-diet={diet || undefined} data-region={region ?? undefined}>
        {children}
      </div>
    </ScopeContext.Provider>
  );
}
