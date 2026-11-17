// The menu. Edit this file to change dishes, prices and today's specials.
// Everything here is placeholder content for a fictitious trattoria. Italian names are written with
// their accents (ragù, tiramisù) and each has a plain English description beside it.
// Plain strings only: text is rendered as text, never as HTML.

import type { PastaShape } from '../lib/pasta-shapes';
import type { RegionId } from '../lib/regions';

// ---------------------------------------------------------------------------------------------
// Today's specials: the edit you'll make most. 2–4 short entries. The first one is the cover line
// on the home page ("From the kitchen: …"), so put the dish you most want people to see first.
// ---------------------------------------------------------------------------------------------

export interface Special {
  /** Italian name, e.g. "Ravioli di zucca". */
  name: string;
  /** One short English sentence. */
  description: string;
  price: number;
  /** Optional: one of the 20 regions (lib/regions.ts), shown as a kicker. */
  region?: RegionId;
  /** Optional: a pasta shape from lib/pasta-shapes.ts, drawn beside the special. */
  shape?: PastaShape;
}

export const specials: Special[] = [
  {
    name: 'Ravioli di zucca',
    description: 'Hand-cut ravioli of roast squash and amaretti, with brown butter and sage.',
    price: 27,
    region: 'lombardia',
    shape: 'ravioli',
  },
  {
    name: 'Zuppa di ceci e castagne',
    description: 'Chickpeas and chestnuts simmered with rosemary, finished with new olive oil.',
    price: 14,
    region: 'abruzzo',
  },
  {
    name: 'Agnello scottadito',
    description: 'Lamb chops grilled hot enough to burn your fingers, with lemon and salsa verde.',
    price: 36,
    region: 'abruzzo',
  },
];

// ---------------------------------------------------------------------------------------------
// The courses
// ---------------------------------------------------------------------------------------------

export type Diet = 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-nuts';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  'gluten-free': { label: 'Gluten-free ingredients (shared kitchen)', short: 'GF' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
};

export type Badge = 'della-casa' | 'stagionale' | 'new';

export const BADGES: Record<Badge, string> = {
  'della-casa': 'Della casa',
  stagionale: 'Stagionale',
  new: 'New',
};

/** Small drawing at the head of a course chapter (components/course-art.tsx). */
export type CourseArt = 'olives' | 'pasta-nest' | 'roast' | 'artichoke' | 'lemon-tart';

export interface Dish {
  /** Unique, lowercase and hyphenated. Also the page anchor: /menu/#tagliatelle-al-ragu. */
  id: string;
  /** Italian name, properly accented, e.g. "Tagliatelle al ragù". */
  name: string;
  /** Plain English description: what it is and what's in it. */
  description: string;
  /** Price in `menu.currency`, e.g. 26 or 14.5. */
  price: number;
  /** Where the recipe comes from: one of Italy's 20 regions (lib/regions.ts). */
  region: RegionId;
  /** Pasta shape, drawn as a plate in the pasta atlas. Required for pasta primi. */
  shape?: PastaShape;
  /** Dietary marks. Vegan dishes count as vegetarian in the filters. */
  diet?: Diet[];
  /** Id of a wine in content/wine.ts that goes well with it. */
  pairing?: string;
  badge?: Badge;
  /** Set large on the menu with a pull quote. Keep one or two per course. */
  featured?: boolean;
  /** Short line set as a pull quote beside a featured dish. */
  pullQuote?: string;
  /** Finished for today: the dish stays listed, marked "Finito for today". Remove the line when it's back. */
  soldOut?: boolean;
}

export interface Course {
  /** Unique, lowercase and hyphenated. Also the page anchor: /menu/#primi. */
  id: string;
  /** Italian title, set huge across the chapter, e.g. "Primi". */
  title: string;
  /** English subtitle, e.g. "First courses". */
  subtitle: string;
  /** Roman numeral for the chapter, e.g. "II". */
  numeral: string;
  /** A sentence or two introducing the course. */
  description: string;
  art: CourseArt;
  dishes: Dish[];
}

export const courses: Course[] = [
  {
    id: 'antipasti',
    title: 'Antipasti',
    subtitle: 'Before the meal',
    numeral: 'I',
    description: 'Small plates to share while the pasta water comes to the boil. Order a few for the table and pass them along.',
    art: 'olives',
    dishes: [
      {
        id: 'tagliere-di-affettati', name: 'Tagliere di affettati', region: 'emilia-romagna', price: 26,
        description: 'Prosciutto di Parma, mortadella and coppa sliced to order, with warm gnocco fritto and pickled vegetables. For two.',
        pairing: 'lambrusco-di-sorbara', badge: 'della-casa', featured: true,
        pullQuote: 'Slice it thin enough to read the newspaper through, and serve it with something fried.',
      },
      {
        id: 'vitello-tonnato', name: 'Vitello tonnato', region: 'piemonte', price: 17,
        description: 'Cold, thinly sliced veal under a silky sauce of tuna, capers and lemon.',
        diet: ['gluten-free'], pairing: 'verdicchio',
      },
      {
        id: 'burrata-con-peperoni', name: 'Burrata con peperoni arrostiti', region: 'puglia', price: 18,
        description: 'Creamy burrata with peppers roasted over the flame, basil and grilled bread.',
        diet: ['vegetarian'], pairing: 'cerasuolo-d-abruzzo',
      },
      {
        id: 'arancini', name: 'Arancini al ragù', region: 'sicilia', price: 15,
        description: 'Crisp saffron rice balls with a heart of slow-cooked ragù, peas and caciocavallo. Three to a plate.',
        pairing: 'nero-d-avola',
      },
      {
        id: 'carciofi-alla-giudia', name: 'Carciofi alla giudia', region: 'lazio', price: 16,
        description: 'Whole artichokes fried twice until the leaves open like a flower and crackle. Salt and lemon.',
        diet: ['vegan', 'gluten-free'], pairing: 'bianco-della-casa', badge: 'stagionale',
      },
    ],
  },
  {
    id: 'primi',
    title: 'Primi',
    subtitle: 'First courses',
    numeral: 'II',
    description: 'Pasta rolled this morning on the long board, each shape cooked the way its home region likes it. Every plate can be a half portion.',
    art: 'pasta-nest',
    dishes: [
      {
        id: 'tagliatelle-al-ragu', name: 'Tagliatelle al ragù', region: 'emilia-romagna', shape: 'tagliatelle', price: 26,
        description: 'Egg ribbons with a ragù of beef and pork cooked low for four hours with milk and a little tomato.',
        pairing: 'lambrusco-di-sorbara', badge: 'della-casa', featured: true,
        pullQuote: 'Ragù is not a sauce, it is an afternoon. Start it after breakfast.',
      },
      {
        id: 'cacio-e-pepe', name: 'Cacio e pepe', region: 'lazio', shape: 'spaghetti', price: 22,
        description: 'Spaghetti, pecorino romano and a great deal of toasted black pepper, tossed into a creamy sauce.',
        pairing: 'verdicchio',
      },
      {
        id: 'orecchiette-cime-di-rapa', name: 'Orecchiette con le cime di rapa', region: 'puglia', shape: 'orecchiette', price: 23,
        description: 'Little ears with bitter turnip greens, garlic, chilli and toasted breadcrumbs. Ask for anchovies.',
        diet: ['vegan'], pairing: 'cerasuolo-d-abruzzo',
      },
      {
        id: 'pappardelle-al-cinghiale', name: 'Pappardelle al cinghiale', region: 'toscana', shape: 'pappardelle', price: 29,
        description: 'Wide ribbons with wild boar braised in red wine, juniper and rosemary.',
        pairing: 'chianti-classico', badge: 'stagionale',
      },
      {
        id: 'tortellini-in-brodo', name: 'Tortellini in brodo', region: 'emilia-romagna', shape: 'tortellini', price: 25,
        description: 'Tiny folded pasta filled with pork, prosciutto and parmigiano, in a clear capon broth.',
        pairing: 'lambrusco-di-sorbara', soldOut: true,
      },
      {
        id: 'trofie-al-pesto', name: 'Trofie al pesto', region: 'liguria', shape: 'trofie', price: 22,
        description: 'Hand-rolled twists with basil pesto pounded in the mortar, potatoes and green beans.',
        diet: ['vegetarian', 'contains-nuts'], pairing: 'vermentino-di-gallura',
      },
      {
        id: 'lasagne', name: 'Lasagne alla bolognese', region: 'emilia-romagna', shape: 'lasagne', price: 27,
        description: 'Green spinach sheets layered with ragù, béchamel and parmigiano, baked until the corners crisp.',
        pairing: 'rosso-della-casa',
      },
      {
        id: 'gnocchi-alla-sorrentina', name: 'Gnocchi alla sorrentina', region: 'campania', shape: 'gnocchi', price: 23,
        description: 'Soft potato gnocchi baked in tomato with melting fior di latte and basil.',
        diet: ['vegetarian'], pairing: 'fiano-di-avellino',
      },
    ],
  },
  {
    id: 'secondi',
    title: 'Secondi',
    subtitle: 'Main courses',
    numeral: 'III',
    description: 'Meat, fish and one generous vegetable dish, served simply. Add a contorno or two from the next page.',
    art: 'roast',
    dishes: [
      {
        id: 'ossobuco', name: 'Ossobuco alla milanese', region: 'lombardia', price: 42,
        description: 'Veal shin braised with white wine until it falls from the bone, with gremolata and saffron risotto.',
        diet: ['gluten-free'], pairing: 'langhe-nebbiolo', badge: 'della-casa', featured: true,
        pullQuote: 'The marrow is the best part. There is a small spoon for it, and nobody is watching.',
      },
      {
        id: 'saltimbocca', name: 'Saltimbocca alla romana', region: 'lazio', price: 34,
        description: 'Veal escalopes with prosciutto and sage, pan-fried in butter and white wine.',
        pairing: 'rosso-della-casa',
      },
      {
        id: 'branzino', name: 'Branzino all’acqua pazza', region: 'campania', price: 38,
        description: 'Whole sea bass poached in “crazy water”: cherry tomatoes, garlic, parsley and white wine.',
        diet: ['gluten-free'], pairing: 'fiano-di-avellino',
      },
      {
        id: 'parmigiana', name: 'Parmigiana di melanzane', region: 'sicilia', price: 26,
        description: 'Layers of fried aubergine, tomato, basil and parmigiano, baked and rested so it slices cleanly.',
        diet: ['vegetarian', 'gluten-free'], pairing: 'nero-d-avola',
      },
    ],
  },
  {
    id: 'contorni',
    title: 'Contorni',
    subtitle: 'On the side',
    numeral: 'IV',
    description: 'Vegetables to share with the secondi, cooked the way they are at home.',
    art: 'artichoke',
    dishes: [
      {
        id: 'patate-al-rosmarino', name: 'Patate al forno', region: 'toscana', price: 9,
        description: 'Potatoes roasted with rosemary, garlic and plenty of olive oil.',
        diet: ['vegan', 'gluten-free'],
      },
      {
        id: 'cicoria-ripassata', name: 'Cicoria ripassata', region: 'lazio', price: 9,
        description: 'Wild chicory boiled, then “passed again” in the pan with garlic and chilli.',
        diet: ['vegan', 'gluten-free'],
      },
      {
        id: 'insalata-di-finocchi', name: 'Insalata di finocchi e arance', region: 'sicilia', price: 10,
        description: 'Shaved fennel, blood orange, black olives and red onion.',
        diet: ['vegan', 'gluten-free'],
      },
    ],
  },
  {
    id: 'dolci',
    title: 'Dolci',
    subtitle: 'Sweets, then coffee',
    numeral: 'V',
    description: 'Something sweet, a little glass of something, then a coffee. That is how a meal ends.',
    art: 'lemon-tart',
    dishes: [
      {
        id: 'tiramisu', name: 'Tiramisù', region: 'veneto', price: 12,
        description: 'Savoiardi soaked in espresso, layered with mascarpone cream and cocoa. Made the day before.',
        diet: ['vegetarian'], pairing: 'vin-santo', badge: 'della-casa', featured: true,
        pullQuote: 'Tiramisù is better the next day. So is the gossip.',
      },
      {
        id: 'panna-cotta', name: 'Panna cotta', region: 'piemonte', price: 11,
        description: 'Barely set vanilla cream with saba, a syrup of cooked grape must.',
        diet: ['vegetarian', 'gluten-free'], pairing: 'passito-di-pantelleria',
      },
      {
        id: 'cannoli', name: 'Cannoli siciliani', region: 'sicilia', price: 12,
        description: 'Crisp shells filled to order with sweet ricotta, candied orange and pistachio.',
        diet: ['vegetarian', 'contains-nuts'], pairing: 'passito-di-pantelleria',
      },
      {
        id: 'affogato', name: 'Affogato alla nocciola', region: 'piemonte', price: 10,
        description: 'Hazelnut gelato “drowned” in a hot shot of espresso at the table.',
        diet: ['vegetarian', 'gluten-free', 'contains-nuts'], badge: 'new',
      },
    ],
  },
];

// ---------------------------------------------------------------------------------------------
// Sunday lunch: the long shared table
// ---------------------------------------------------------------------------------------------

export type SundayCourse =
  /** A dish from the menu above, by id: it links to the dish. */
  | { dish: string }
  /** Or a short label for something only on the Sunday table. */
  | { label: string };

export interface SundayLunch {
  /** The set menu, in the order it comes to the table. */
  courses: SundayCourse[];
  /** Price per adult, in `menu.currency`. */
  pricePerPerson: number;
  /** Price for children under 12. */
  childrenPrice: number;
  /** When and how it's served. */
  served: string;
  /** Pull quote for the home page feature. */
  quote: string;
}

export const sundayLunch: SundayLunch = {
  courses: [
    { dish: 'tagliere-di-affettati' },
    { label: 'Bread, olives and a bowl of the week’s pickles' },
    { dish: 'tagliatelle-al-ragu' },
    { label: 'Porchetta with crackling, or a whole roast chicken with lemon' },
    { dish: 'patate-al-rosmarino' },
    { dish: 'cicoria-ripassata' },
    { dish: 'tiramisu' },
  ],
  pricePerPerson: 58,
  childrenPrice: 22,
  served: 'Sundays from 12 to 4, at one long table down the middle of the room. Platters are passed hand to hand; seconds are expected. A vegetarian main is always ready, just tell us when you sit down.',
  quote: 'Nobody gets their own plate of antipasti on a Sunday. You pass it to the stranger beside you, and by the pasta they aren’t a stranger.',
};

// ---------------------------------------------------------------------------------------------

export const menu = {
  /** ISO 4217 currency for every price. */
  currency: 'USD',
  /** Locale used to format prices. */
  locale: 'en-US',
  /** Shown near the top and bottom of the menu page. */
  allergenNote:
    'Our kitchen uses wheat, eggs, milk, nuts, fish and shellfish every day. GF marks dishes made with gluten-free ingredients, cooked in a shared kitchen. Please tell us about allergies before you order.',
  /** Smaller notes at the foot of the menu. */
  notes: [
    'Any primo can be a half portion.',
    'Gluten-free pasta is available for most primi; please allow an extra ten minutes.',
  ],
};

export const allDishes: Dish[] = courses.flatMap(course => course.dishes);

export function findDish(id: string): Dish | undefined {
  return allDishes.find(dish => dish.id === id);
}

export function courseOf(id: string): Course | undefined {
  return courses.find(course => course.dishes.some(dish => dish.id === id));
}

const formatter = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency });

/** "$26", or "$14.50" for amounts with cents. */
export function formatPrice(amount: number): string {
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** Primi with a pasta shape, in menu order: the plates of the pasta atlas. */
export const pastaDishes: Dish[] = allDishes.filter(dish => dish.shape);

/** "Fig. 3": each pasta dish's plate number, in menu order. */
export function figureNumber(id: string): number | undefined {
  const index = pastaDishes.findIndex(dish => dish.id === id);
  return index >= 0 ? index + 1 : undefined;
}

/** Plates shown in the home page atlas: up to six, in menu order. */
export const atlasDishes: Dish[] = pastaDishes.slice(0, 6);
