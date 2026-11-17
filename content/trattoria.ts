// Trattoria details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious trattoria and family. The sample address is
// a public landmark (the Paul Revere Mall in Boston's North End) so the map has something to show;
// replace it with yours. Plain strings only: text is rendered as text, never as HTML.

import { groupedHours as group, weekSummary, type DayHours } from '../lib/hours.ts';

export interface StoryPoint {
  title: string;
  detail: string;
}

export interface Marginalia {
  /** A short handwritten note from Nonna, one or two lines. */
  text: string;
  /** Optional dish id from content/menu.ts: the note sits beside that dish on the menu. */
  dish?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface TrattoriaLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Trattoria {
  /** The name, set as the masthead. Also change `name` in site.config.json. */
  name: string;
  /** What the name means, or a short line under it. */
  tagline: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** "Our story" paragraphs. The first gets a drop cap. */
  story: string[];
  /** Three short points under the story. */
  storyPoints: StoryPoint[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(555) 014-2290". Set to '' to hide it. */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Landmark or cross streets shown under the address. */
    note?: string;
  };
  /** How to get here: transit, parking, step-free access. */
  directions: string[];
  /**
   * Every day of the week, Monday first, with its services in local time (the time zone is `timeZone`
   * in site.config.json). `services: []` means closed all day. A day can have a lunch and a dinner.
   */
  hours: DayHours[];
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  /** Nonna's notes in the margins. */
  marginalia: Marginalia[];
  amenities: string[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: TrattoriaLink[];
}

export const trattoria: Trattoria = {
  name: 'La Tavola Lunga',
  tagline: 'The long table · cucina di famiglia',
  introduction:
    'A family trattoria in the North End. Pasta rolled every morning, recipes from Emilia-Romagna to Puglia, a short honest wine list, and on Sundays one long table for everyone.',
  story: [
    'It began with a pasta board. Nonna Lucia brought it from Bologna wrapped in a tablecloth: a slab of beech worn pale in the middle, where sixty years of flour and eggs had been worked into sheets. Her daughter learned on it, and now her grandson rolls the day’s tagliatelle on it before the doors open.',
    'Lucia married a man from Bari, so the family cooks from both ends of Italy: ragù and tortellini from the north, orecchiette and bitter greens from the heel of the boot, and whatever the season brings in between. The recipes are written in three handwritings in one stained notebook, and we still argue about them.',
  ],
  storyPoints: [
    { title: 'Rolled each morning', detail: 'Every ribbon, ear and parcel of pasta is made by hand on the long board, the same day you eat it.' },
    { title: 'Recipes by region', detail: 'Each dish comes from a real place, and the menu tells you where. Ask us about any of them.' },
    { title: 'A short, honest wine list', detail: 'A page of wines from small growers across Italy, every one by the glass, none of them fussy.' },
  ],
  email: 'hello@example.com',
  phone: '(555) 014-2290',
  address: {
    street: 'Paul Revere Mall',
    locality: 'Boston',
    region: 'MA',
    postalCode: '02113',
    country: 'US',
    note: 'On the Prado off Hanover Street, by the Paul Revere statue, North End',
  },
  directions: [
    'Haymarket station (Orange and Green Lines) is a ten-minute walk: cross the Greenway and follow Hanover Street to the Prado.',
    'North End streets are narrow and parking is scarce. The garages near Haymarket and on Commercial Street are the easiest bet.',
    'Step-free entrance from the Prado, and an accessible restroom on the ground floor.',
  ],
  hours: [
    { day: 'Monday', services: [] },
    { day: 'Tuesday', services: [{ label: 'Dinner', opens: '17:00', closes: '22:00' }] },
    { day: 'Wednesday', services: [{ label: 'Dinner', opens: '17:00', closes: '22:00' }] },
    { day: 'Thursday', services: [{ label: 'Dinner', opens: '17:00', closes: '22:00' }] },
    { day: 'Friday', services: [{ label: 'Dinner', opens: '17:00', closes: '22:00' }] },
    { day: 'Saturday', services: [{ label: 'Dinner', opens: '17:00', closes: '22:00' }] },
    { day: 'Sunday', services: [{ label: 'Sunday lunch', opens: '12:00', closes: '16:00' }] },
  ],
  notice: '',
  marginalia: [
    { text: 'Ask for the end piece of the lasagne. The crispy corner is the cook’s, but we can be persuaded.', dish: 'lasagne' },
    { text: 'Four hours for the ragù. Anyone who says three is in a hurry.', dish: 'tagliatelle-al-ragu' },
    { text: 'Orecchiette are pressed with the thumb, one at a time. Count them if you have an afternoon.', dish: 'orecchiette-cime-di-rapa' },
    { text: 'Fry the artichokes twice. The second time, they open like roses.', dish: 'carciofi-alla-giudia' },
    { text: 'The fennel salad is for after the meat, not before. Trust me.', dish: 'insalata-di-finocchi' },
    { text: 'Squash ravioli in autumn, peas in spring. Never the other way round.' },
    { text: 'On Sundays we push the tables together. Sit next to someone new.' },
  ],
  amenities: [
    'High chairs and half portions for children',
    'Step-free entrance and accessible restroom',
    'Private room for up to 24 guests',
  ],
  faqs: [
    {
      question: 'Do you take reservations?',
      answer: 'Small tables are walk-in, first come, first served; there is usually a short wait on Fridays and Saturdays. For six or more, the private room or a celebration, send us an enquiry from the Contact page and we’ll reply to confirm.',
    },
    {
      question: 'Is Sunday lunch at a shared table?',
      answer: 'Yes. From 12 to 4 on Sundays we push the tables into one long table and serve a set menu on platters to pass along. You’ll sit with your own party, beside other families. Smaller tables by the window are kept for anyone who would rather not share.',
    },
    {
      question: 'Do you have vegetarian and vegan dishes?',
      answer: 'Plenty. The menu marks vegetarian (V) and vegan (VG) dishes, and you can filter for them. Most pasta can be made without meat or cheese; just ask.',
    },
    {
      question: 'Can you cook gluten-free?',
      answer: 'Our fresh pasta is made with wheat and eggs, but we keep a dried gluten-free pasta for most primi. GF marks dishes made with gluten-free ingredients; they are cooked in a kitchen full of flour, so we can’t promise against traces.',
    },
    {
      question: 'Are children welcome?',
      answer: 'Always. We have high chairs, half portions of any pasta, and a children’s price for Sunday lunch.',
    },
    {
      question: 'Can I bring my own wine?',
      answer: 'Yes, corkage is $25 a bottle, and we waive it if you also order a bottle from our list.',
    },
    {
      question: 'Do you host private dinners?',
      answer: 'Our back room seats up to 24 for birthdays, rehearsal dinners and long family lunches. Send an enquiry with the date and number of guests and we’ll write back with menus.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Facebook', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = trattoria.links.filter(link => link.url.trim() !== '');

/** Single-line postal address. */
export function formatAddress(address = trattoria.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** The week's hours grouped for display: "Tue – Sat · Dinner 5pm – 10pm". */
export function groupedHours() {
  return group(trattoria.hours);
}

/** Phone number as a tel: link. */
export function telHref(phone = trattoria.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** Nonna's note for one dish, if she wrote one. */
export function noteFor(dishId: string): Marginalia | undefined {
  return trattoria.marginalia.find(note => note.dish === dishId);
}

/** Notes that aren't attached to a dish, for the home page. */
export const looseNotes = trattoria.marginalia.filter(note => !note.dish);

/** Neutral one-line hours, safe to show without knowing today's date. */
export function hoursSummary(): string {
  return weekSummary(trattoria.hours);
}
