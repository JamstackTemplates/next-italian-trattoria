// The wine list. Edit this file to change wines, prices and notes.
// Names are denominations and grapes with generic or invented producers ("Rosso della casa"), never a
// real winery or brand. Plain strings only: text is rendered as text, never as HTML.
// Dishes point at wines with `pairing` in content/menu.ts; the wine page lists those dishes for you.

import type { RegionId } from '../lib/regions';

export type WineStyle = 'sparkling' | 'white' | 'rose' | 'red' | 'dessert';

/** Wine-list sections in order, with their Italian headings. */
export const WINE_STYLES: readonly { id: WineStyle; title: string; subtitle: string }[] = [
  { id: 'sparkling', title: 'Bollicine', subtitle: 'Sparkling' },
  { id: 'white', title: 'Bianchi', subtitle: 'White' },
  { id: 'rose', title: 'Rosati', subtitle: 'Rosé' },
  { id: 'red', title: 'Rossi', subtitle: 'Red' },
  { id: 'dessert', title: 'Dolci', subtitle: 'Dessert wines' },
];

export interface Wine {
  /** Unique, lowercase and hyphenated. Also the page anchor: /wine/#chianti-classico. */
  id: string;
  /** As printed on the list, e.g. "Chianti Classico" or "Rosso della casa". No real producers. */
  name: string;
  /** Grape or blend, e.g. "Sangiovese". */
  grape: string;
  /** Denomination, e.g. "DOCG", "DOC" or "IGT". Leave '' for a house blend without one. */
  denomination: string;
  /** One of Italy's 20 regions (lib/regions.ts). Shades the map on the wine page. */
  region: RegionId;
  style: WineStyle;
  /** Price of a glass, in `wineList.currency`. */
  glass: number;
  /** Price of a bottle, in `wineList.currency`. */
  bottle: number;
  /** A line or two of tasting notes. */
  notes: string;
  /** House wines are listed first, in the "by the glass" section. */
  house?: boolean;
  /** Set large with a drawing at the top of its section. */
  featured?: boolean;
}

export const wines: Wine[] = [
  // Della casa: the house wines, poured by the glass or the carafe.
  {
    id: 'rosso-della-casa', name: 'Rosso della casa', grape: 'Sangiovese', denomination: 'IGT', region: 'toscana', style: 'red',
    glass: 11, bottle: 40, house: true,
    notes: 'Our everyday red: cherries, a little dried herb, enough grip for ragù. Poured from the jug.',
  },
  {
    id: 'bianco-della-casa', name: 'Bianco della casa', grape: 'Trebbiano', denomination: 'DOC', region: 'abruzzo', style: 'white',
    glass: 10, bottle: 36, house: true,
    notes: 'Clean, lemony and soft. The wine for a long lunch and a second plate of antipasti.',
  },
  {
    id: 'prosecco-della-casa', name: 'Prosecco della casa', grape: 'Glera', denomination: 'DOC', region: 'veneto', style: 'sparkling',
    glass: 12, bottle: 44, house: true,
    notes: 'Pear and white flowers, fine bubbles. Aperitivo, or the start of any celebration.',
  },

  // Bollicine
  {
    id: 'lambrusco-di-sorbara', name: 'Lambrusco di Sorbara', grape: 'Lambrusco di Sorbara', denomination: 'DOC', region: 'emilia-romagna', style: 'sparkling',
    glass: 12, bottle: 42, featured: true,
    notes: 'Pale, dry and frothing with wild strawberry. Made to cut through mortadella and ragù.',
  },
  // Bianchi
  {
    id: 'vermentino-di-gallura', name: 'Vermentino di Gallura', grape: 'Vermentino', denomination: 'DOCG', region: 'sardegna', style: 'white',
    glass: 14, bottle: 52,
    notes: 'Sea breeze and bitter almond, with a salty finish that loves basil and anything from the sea.',
  },
  {
    id: 'verdicchio', name: 'Verdicchio dei Castelli di Jesi', grape: 'Verdicchio', denomination: 'DOC', region: 'marche', style: 'white',
    glass: 13, bottle: 48, featured: true,
    notes: 'Green apple and fennel, round in the middle. A white that stands up to pecorino.',
  },
  {
    id: 'fiano-di-avellino', name: 'Fiano di Avellino', grape: 'Fiano', denomination: 'DOCG', region: 'campania', style: 'white',
    glass: 15, bottle: 56,
    notes: 'Honeyed and smoky from volcanic hills, with hazelnut on the finish.',
  },
  // Rosati
  {
    id: 'cerasuolo-d-abruzzo', name: 'Cerasuolo d’Abruzzo', grape: 'Montepulciano', denomination: 'DOC', region: 'abruzzo', style: 'rose',
    glass: 13, bottle: 46, featured: true,
    notes: 'Deep cherry pink, more red than rosé. Lovely just chilled with burrata and greens.',
  },
  // Rossi
  {
    id: 'chianti-classico', name: 'Chianti Classico', grape: 'Sangiovese', denomination: 'DOCG', region: 'toscana', style: 'red',
    glass: 16, bottle: 60, featured: true,
    notes: 'Sour cherry, violets and Tuscan earth. Born for wild boar and rosemary.',
  },
  {
    id: 'langhe-nebbiolo', name: 'Langhe Nebbiolo', grape: 'Nebbiolo', denomination: 'DOC', region: 'piemonte', style: 'red',
    glass: 17, bottle: 64,
    notes: 'Roses and tar, light in colour and firm in tannin. The little sibling of Barolo.',
  },
  {
    id: 'primitivo-di-manduria', name: 'Primitivo di Manduria', grape: 'Primitivo', denomination: 'DOC', region: 'puglia', style: 'red',
    glass: 14, bottle: 50,
    notes: 'Ripe plum and fig from the heel of the boot. Warm, generous and soft.',
  },
  {
    id: 'nero-d-avola', name: 'Nero d’Avola', grape: 'Nero d’Avola', denomination: 'DOC', region: 'sicilia', style: 'red',
    glass: 13, bottle: 48,
    notes: 'Blackberry, pepper and Sicilian sun. Easy with fried things and aubergine.',
  },
  {
    id: 'aglianico-del-vulture', name: 'Aglianico del Vulture', grape: 'Aglianico', denomination: 'DOC', region: 'basilicata', style: 'red',
    glass: 16, bottle: 62,
    notes: 'Dark, savoury and volcanic: black cherry, leather and smoke. For the slow-cooked secondi.',
  },
  // Dolci
  {
    id: 'vin-santo', name: 'Vin Santo del Chianti', grape: 'Trebbiano & Malvasia', denomination: 'DOC', region: 'toscana', style: 'dessert',
    glass: 13, bottle: 58,
    notes: 'Amber, nutty and dried-apricot sweet. Dip a cantuccio in it; Nonna insists.',
  },
  {
    id: 'passito-di-pantelleria', name: 'Passito di Pantelleria', grape: 'Zibibbo', denomination: 'DOC', region: 'sicilia', style: 'dessert',
    glass: 14, bottle: 64,
    notes: 'Sun-dried grapes from a windswept island: apricot, orange peel and honey.',
  },
];

export const wineList = {
  /** ISO 4217 currency for every price on the list. */
  currency: 'USD',
  /** Locale used to format prices. */
  locale: 'en-US',
  /** A line under the house section. */
  houseNote: 'House wines come by the glass, the half-litre carafe or the bottle.',
  /** Notes at the foot of the list. */
  notes: [
    'Bottles are 750ml; dessert wines are 500ml.',
    'Corkage is $25 a bottle, waived if you also buy one from our list.',
  ],
};

export const houseWines = wines.filter(wine => wine.house);

/** Wines for one section of the list. House wines are listed in their own section first. */
export function winesByStyle(style: WineStyle): Wine[] {
  return wines.filter(wine => wine.style === style && !wine.house);
}

export function findWine(id: string): Wine | undefined {
  return wines.find(wine => wine.id === id);
}
