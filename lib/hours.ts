// Opening hours, services and the "tonight" status. Pure functions with no imports, so they are unit
// tested directly and the browser only supplies the current time in the trattoria's own time zone.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** The kind of sitting. "Sunday lunch" is the long shared table. */
export type ServiceLabel = 'Lunch' | 'Dinner' | 'Sunday lunch';

export const SERVICE_LABELS: readonly ServiceLabel[] = ['Lunch', 'Dinner', 'Sunday lunch'];

export interface Service {
  /** Shown beside the times, e.g. "Dinner". */
  label: ServiceLabel;
  /** 24-hour "HH:MM" local time when the doors open, e.g. "17:00". */
  opens: string;
  /** 24-hour "HH:MM" local time when the kitchen closes, e.g. "22:00". Later than `opens`, same day. */
  closes: string;
}

export interface DayHours {
  day: Day;
  /** Zero or more services, earliest first. An empty list means closed all day. */
  services: Service[];
}

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** "07:30" → "7:30am", "17:00" → "5pm". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** "5pm – 10pm". */
export function formatService(service: Service): string {
  return `${formatTime(service.opens)} – ${formatTime(service.closes)}`;
}

export interface HoursGroup {
  /** "Tue – Sat" or "Monday". */
  label: string;
  /** Services for these days; empty when closed. */
  services: { label: ServiceLabel; hours: string }[];
}

/** Consecutive days with identical services, e.g. Tue – Sat: Dinner 5pm – 10pm. */
export function groupedHours(hours: readonly DayHours[]): HoursGroup[] {
  const key = (entry: DayHours) => entry.services.map(s => `${s.label} ${s.opens}-${s.closes}`).join('|');
  const groups: { days: Day[]; key: string; entry: DayHours }[] = [];
  for (const entry of hours) {
    const last = groups.at(-1);
    if (last && last.key === key(entry)) last.days.push(entry.day);
    else groups.push({ days: [entry.day], key: key(entry), entry });
  }
  const short = (day: Day) => day.slice(0, 3);
  return groups.map(group => ({
    label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
    services: group.entry.services.map(service => ({ label: service.label, hours: formatService(service) })),
  }));
}

export interface NextService {
  day: Day;
  service: Service;
  /** 0 = later today, 1 = tomorrow, and so on. */
  daysAhead: number;
}

export type TonightState =
  /** Inside a service. `minutesLeft` counts down to the kitchen closing. */
  | { status: 'open'; service: Service; minutesLeft: number }
  /** Nothing served yet today, but a service starts later today. */
  | { status: 'later'; next: NextService }
  /** A service has run today and another starts later today (a lunch-and-dinner day). */
  | { status: 'between'; next: NextService }
  /** Today's last service has finished. */
  | { status: 'finished'; next?: NextService }
  /** No service at all today. */
  | { status: 'closed-today'; next?: NextService };

/** Minutes before the kitchen closes when the status switches to "Kitchen closing in N minutes". */
export const CLOSING_SOON_MINUTES = 30;

/** The next service that opens after `minutes` today, or on a following day (up to a week ahead). */
export function nextService(day: Day, minutes: number, hours: readonly DayHours[]): NextService | undefined {
  const start = DAYS.indexOf(day);
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const candidate = DAYS[(start + daysAhead) % 7];
    const services = hours.find(entry => entry.day === candidate)?.services ?? [];
    for (const service of services) {
      if (daysAhead === 0 && toMinutes(service.opens) <= minutes) continue;
      return { day: candidate, service, daysAhead };
    }
  }
  return undefined;
}

/**
 * Where the trattoria stands at a local day and time (`minutes` after midnight in its own time zone).
 * Days may have more than one service (e.g. lunch and dinner); each is checked in turn.
 */
export function tonightState(day: Day, minutes: number, hours: readonly DayHours[]): TonightState {
  const today = hours.find(entry => entry.day === day)?.services ?? [];
  for (const service of today) {
    if (minutes >= toMinutes(service.opens) && minutes < toMinutes(service.closes)) {
      return { status: 'open', service, minutesLeft: toMinutes(service.closes) - minutes };
    }
  }
  const next = nextService(day, minutes, hours);
  if (!today.length) return { status: 'closed-today', next };
  const servedToday = today.some(service => toMinutes(service.opens) <= minutes);
  if (next && next.daysAhead === 0) return servedToday ? { status: 'between', next } : { status: 'later', next };
  return { status: 'finished', next };
}

export type TonightTone = 'open' | 'soon' | 'closed';

function opening(next: NextService | undefined): string {
  if (!next) return '';
  const when = next.daysAhead === 0 ? 'today' : next.day;
  return ` · open ${when} from ${formatTime(next.service.opens)}`;
}

/** Words for the status line, e.g. "Open tonight · kitchen until 10pm". */
export function describeTonight(state: TonightState, closingSoon = CLOSING_SOON_MINUTES): { text: string; tone: TonightTone } {
  switch (state.status) {
    case 'open': {
      if (state.minutesLeft <= closingSoon) {
        return { text: `Kitchen closing in ${state.minutesLeft} minute${state.minutesLeft === 1 ? '' : 's'}`, tone: 'soon' };
      }
      const until = formatTime(state.service.closes);
      if (state.service.label === 'Sunday lunch') return { text: `Sunday lunch · until ${until}`, tone: 'open' };
      if (state.service.label === 'Lunch') return { text: `Open for lunch · kitchen until ${until}`, tone: 'open' };
      return { text: `Open tonight · kitchen until ${until}`, tone: 'open' };
    }
    case 'later': {
      const from = formatTime(state.next.service.opens);
      if (state.next.service.label === 'Sunday lunch') return { text: `Sunday lunch today · from ${from}`, tone: 'closed' };
      if (state.next.service.label === 'Lunch') return { text: `Open for lunch today · from ${from}`, tone: 'closed' };
      return { text: `Open tonight · from ${from}`, tone: 'closed' };
    }
    case 'between':
      return { text: `Between services · ${state.next.service.label.toLowerCase()} from ${formatTime(state.next.service.opens)}`, tone: 'closed' };
    case 'finished':
      return { text: `Kitchen closed for today${opening(state.next)}`, tone: 'closed' };
    case 'closed-today':
      return { text: `Closed today${opening(state.next)}`, tone: 'closed' };
  }
}

/** Current weekday and minutes after midnight in an IANA time zone. */
export function zonedNow(timeZone: string, date = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: DAYS.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}

/**
 * The week's pattern in one line, with no claim about today: the neutral label shown before the
 * browser knows the time. "Dinner Tue – Sat, 5pm – 10pm · Sunday lunch, 12pm – 4pm".
 */
export function weekSummary(hours: readonly DayHours[]): string {
  return groupedHours(hours).flatMap(group => group.services.map(service =>
    service.label === 'Sunday lunch' ? `Sunday lunch, ${service.hours}` : `${service.label} ${group.label}, ${service.hours}`,
  )).join(' · ');
}
