'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Draws each pasta plate in once, as it scrolls into view. Without JavaScript, or for visitors who
 * prefer reduced motion, the plates are simply there: the hidden state only applies once this runs.
 */
export function PlateObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    const plates = [...document.querySelectorAll<HTMLElement>('.plate:not([data-drawn])')];
    if (!plates.length) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.drawn = '';
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px' });
    root.dataset.drawReady = '';
    // Let the hidden state paint before observing, so plates already on screen still draw in.
    const frame = requestAnimationFrame(() => plates.forEach(plate => observer.observe(plate)));
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [pathname]);
  return null;
}
