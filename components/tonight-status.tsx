'use client';

import { useEffect, useState } from 'react';
import { trattoria } from '../content/trattoria';
import { describeTonight, tonightState, zonedNow, type TonightTone } from '../lib/hours';
import { site } from '../lib/site';

/**
 * "Open tonight · kitchen until 10pm". The static HTML shows a neutral label (the week's pattern);
 * the browser fills in the live state after hydration, using the trattoria's own time zone, and
 * refreshes it every minute. Without a configured time zone it never claims open or closed.
 */
export function TonightStatus({ fallback, className = '' }: { fallback: string; className?: string }) {
  const [state, setState] = useState<{ text: string; tone: TonightTone } | null>(null);

  useEffect(() => {
    if (!site.timeZone) return;
    const update = () => {
      const now = zonedNow(site.timeZone);
      setState(describeTonight(tonightState(now.day, now.minutes, trattoria.hours)));
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className={`status ${className}`} data-tone={state?.tone}>
      <span className="status-dot" aria-hidden="true" />
      <span role="status" aria-live="polite">{state?.text ?? fallback}</span>
    </p>
  );
}
