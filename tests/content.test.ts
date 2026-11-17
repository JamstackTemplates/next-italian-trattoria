// Content invariants for the trattoria, its menu and wine list. Runs with Node's built-in TypeScript
// type stripping. When one of these fails after an edit, the message names the item or day to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import {
  allDishes, atlasDishes, BADGES, courses, DIETS, figureNumber, findDish, formatPrice, menu, pastaDishes, specials, sundayLunch,
} from '../content/menu.ts';
import { formatAddress, hoursSummary, publicLinks, trattoria } from '../content/trattoria.ts';
import { houseWines, WINE_STYLES, wineList, wines } from '../content/wine.ts';
import { DAYS, SERVICE_LABELS, toMinutes } from '../lib/hours.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';
import { matchesDiet } from '../lib/menu-filter.ts';
import { dishesForWine, regionIndex } from '../lib/pairings.ts';
import { isPastaShape } from '../lib/pasta-shapes.ts';
import { isRegionId } from '../lib/regions.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;
const NUMERAL = /^[IVXLC]+$/;

test('courses, dishes and wines have unique, URL-safe ids', () => {
  const ids = [...courses.map(course => course.id), ...allDishes.map(dish => dish.id), ...wines.map(wine => wine.id),
    // Fixed anchors used by the pages.
    'find-us', 'from-the-kitchen', 'faq', 'della-casa', ...WINE_STYLES.map(style => style.id)];
  for (const id of ids) assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `ids must be unique across courses, dishes, wines and page anchors: ${duplicates.join(', ')}`);
});

test('every course is complete, in meal order, with a numeral', () => {
  assert.deepEqual(courses.map(course => course.id), ['antipasti', 'primi', 'secondi', 'contorni', 'dolci'],
    'Keep the five courses in meal order (rename titles freely)');
  for (const course of courses) {
    for (const key of ['title', 'subtitle', 'description'] as const) assert.ok(course[key].trim(), `course ${course.id}.${key}`);
    assert.match(course.numeral, NUMERAL, `course ${course.id}.numeral must be a Roman numeral such as "II"`);
    assert.ok(course.dishes.length >= 1, `course ${course.id} has no dishes`);
  }
});

test('every dish is complete, with a valid region, price and tags', () => {
  for (const dish of allDishes) {
    assert.ok(dish.name.trim(), `${dish.id}.name`);
    assert.ok(dish.description.trim(), `${dish.id}.description`);
    assert.ok(validPrice(dish.price), `${dish.id}: price ${dish.price} must be positive with at most two decimals`);
    assert.ok(isRegionId(dish.region), `${dish.id}: region "${dish.region}" is not one of Italy's 20 regions (lib/regions.ts)`);
    for (const diet of dish.diet ?? []) assert.ok(diet in DIETS, `${dish.id} has unknown diet "${diet}"`);
    assert.equal(new Set(dish.diet).size, dish.diet?.length ?? 0, `${dish.id} repeats a diet tag`);
    if (dish.badge) assert.ok(dish.badge in BADGES, `${dish.id} has unknown badge "${dish.badge}"`);
    if (dish.shape) assert.ok(isPastaShape(dish.shape), `${dish.id}: unknown pasta shape "${dish.shape}"`);
    if (dish.pullQuote !== undefined) assert.ok(dish.pullQuote.trim(), `${dish.id}.pullQuote is empty`);
  }
});

test('pasta primi have a shape for the atlas', () => {
  const primi = courses.find(course => course.id === 'primi')!;
  for (const dish of primi.dishes) assert.ok(dish.shape, `${dish.id}: add a pasta \`shape\` so it gets its plate in the atlas`);
  assert.ok(atlasDishes.length >= 4 && atlasDishes.length <= 6, 'The home page atlas needs 4–6 pasta dishes with a shape');
  assert.equal(figureNumber(pastaDishes[0].id), 1);
});

test('every pairing points at a wine that exists', () => {
  for (const dish of allDishes) {
    if (dish.pairing) assert.ok(wines.some(wine => wine.id === dish.pairing), `${dish.id}: pairing "${dish.pairing}" is not a wine id in content/wine.ts`);
  }
  assert.deepEqual(dishesForWine('lambrusco-di-sorbara').map(dish => dish.id).slice(0, 2), ['tagliere-di-affettati', 'tagliatelle-al-ragu']);
});

test('the menu covers the sample’s promises: sold out, vegetarian and regional range', () => {
  assert.ok(allDishes.some(dish => dish.soldOut), 'Keep at least one dish marked soldOut in the sample');
  assert.ok(allDishes.filter(dish => matchesDiet(dish, 'vegetarian')).length >= 5, 'At least five vegetarian dishes');
  assert.ok(new Set(allDishes.map(dish => dish.region)).size >= 8, 'Dishes from at least eight regions');
  const featured = allDishes.filter(dish => dish.featured);
  assert.ok(featured.length >= 3 && featured.length <= 8, 'Mark 3–8 dishes featured: true (one or two per course)');
});

test('diet filters: vegan counts as vegetarian', () => {
  assert.ok(matchesDiet({ diet: ['vegan'] }, 'vegetarian'));
  assert.ok(!matchesDiet({ diet: ['vegetarian'] }, 'vegan'));
  assert.ok(matchesDiet({}, ''));
  assert.ok(!matchesDiet({}, 'vegetarian'));
});

test('today’s specials: 2–4 short entries at the top of the menu', () => {
  assert.ok(specials.length >= 2 && specials.length <= 4, 'List 2–4 specials (the first is the home page cover line)');
  for (const special of specials) {
    assert.ok(special.name.trim() && special.description.trim(), `special "${special.name}" needs a name and description`);
    assert.ok(special.description.length <= 140, `special "${special.name}": keep the description to one short sentence`);
    assert.ok(validPrice(special.price), `special "${special.name}" price ${special.price}`);
    if (special.region) assert.ok(isRegionId(special.region), `special "${special.name}": unknown region "${special.region}"`);
    if (special.shape) assert.ok(isPastaShape(special.shape), `special "${special.name}": unknown shape "${special.shape}"`);
  }
});

test('Sunday lunch refers to real dishes and has prices', () => {
  assert.ok(sundayLunch.courses.length >= 3, 'Sunday lunch needs at least three courses');
  for (const course of sundayLunch.courses) {
    if ('dish' in course) assert.ok(findDish(course.dish), `sundayLunch: dish "${course.dish}" is not a dish id in content/menu.ts`);
    else assert.ok(course.label.trim(), 'sundayLunch: empty label');
  }
  assert.ok(validPrice(sundayLunch.pricePerPerson), 'sundayLunch.pricePerPerson');
  assert.ok(validPrice(sundayLunch.childrenPrice) && sundayLunch.childrenPrice < sundayLunch.pricePerPerson, 'sundayLunch.childrenPrice');
  assert.ok(sundayLunch.served.trim() && sundayLunch.quote.trim());
});

test('the wine list is complete and valid', () => {
  assert.ok(wines.length >= 12 && wines.length <= 16, 'Keep 12–16 wines on the sample list');
  assert.ok(new Set(wines.map(wine => wine.region)).size >= 8, 'Wines from at least eight regions');
  assert.ok(houseWines.length >= 1 && houseWines.length <= 4, 'Keep 1–4 house wines (house: true)');
  const styles = WINE_STYLES.map(style => style.id);
  for (const wine of wines) {
    for (const key of ['name', 'grape', 'notes'] as const) assert.ok(wine[key].trim(), `${wine.id}.${key}`);
    assert.ok(isRegionId(wine.region), `${wine.id}: region "${wine.region}" is not one of Italy's 20 regions`);
    assert.ok(styles.includes(wine.style), `${wine.id}: style "${wine.style}" must be one of ${styles.join(', ')}`);
    assert.ok(validPrice(wine.glass), `${wine.id}: glass price ${wine.glass}`);
    assert.ok(validPrice(wine.bottle), `${wine.id}: bottle price ${wine.bottle}`);
    assert.ok(wine.bottle > wine.glass, `${wine.id}: a bottle should cost more than a glass`);
  }
  assert.ok(wineList.notes.every(note => note.trim()));
});

test('prices format in the menu currency', () => {
  assert.equal(formatPrice(26), '$26');
  assert.equal(formatPrice(14.5), '$14.50');
  assert.doesNotThrow(() => new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency }));
  assert.equal(wineList.currency, menu.currency, 'The wine list and menu share one currency');
});

test('the region index covers every region the content visits', () => {
  const index = regionIndex();
  const regions = new Set([...allDishes.map(d => d.region), ...wines.map(w => w.region)]);
  for (const id of regions) assert.ok(index.some(entry => entry.id === id), `region ${id} missing from the index`);
});

test('opening hours list each day once with valid services', () => {
  assert.deepEqual(trattoria.hours.map(entry => entry.day), [...DAYS], 'List every day once, Monday first');
  for (const entry of trattoria.hours) {
    let previousClose = -1;
    for (const service of entry.services) {
      assert.ok(SERVICE_LABELS.includes(service.label), `${entry.day}: unknown service "${service.label}"`);
      assert.match(service.opens, /^([01]\d|2[0-3]):[0-5]\d$/, `${entry.day} ${service.label}.opens`);
      assert.match(service.closes, /^([01]\d|2[0-3]):[0-5]\d$/, `${entry.day} ${service.label}.closes`);
      assert.ok(toMinutes(service.opens) < toMinutes(service.closes), `${entry.day} ${service.label} must open before it closes`);
      assert.ok(toMinutes(service.opens) >= previousClose, `${entry.day}: services must be in order and not overlap`);
      previousClose = toMinutes(service.closes);
      if (service.label === 'Sunday lunch') assert.equal(entry.day, 'Sunday', `${entry.day}: "Sunday lunch" is only for Sunday`);
    }
  }
  assert.equal(hoursSummary(), 'Dinner Tue – Sat, 5pm – 10pm · Sunday lunch, 12pm – 4pm');
});

test('Nonna’s marginalia sit beside dishes that exist', () => {
  assert.ok(trattoria.marginalia.length >= 3, 'Keep a few of Nonna’s notes');
  for (const note of trattoria.marginalia) {
    assert.ok(note.text.trim() && note.text.length <= 140, `marginalia "${note.text.slice(0, 30)}…": keep notes short`);
    if (note.dish) assert.ok(findDish(note.dish), `marginalia: dish "${note.dish}" is not a dish id in content/menu.ts`);
  }
  const dishes = trattoria.marginalia.flatMap(note => note.dish ? [note.dish] : []);
  assert.equal(new Set(dishes).size, dishes.length, 'At most one of Nonna’s notes per dish');
  assert.ok(trattoria.marginalia.some(note => !note.dish), 'Keep at least one note without a dish for the home page');
});

test('contact details and links are publishable', () => {
  assert.match(trattoria.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(trattoria.faqs.length >= 1 && trattoria.storyPoints.length === 3, 'Three story points under "Our story"');
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(trattoria.address[key].trim(), `address.${key}`);
  assert.match(trattoria.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, 'Paul Revere Mall, Boston, MA 02113');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=Paul%20Revere%20Mall'));
  assert.equal(mapEmbedUrl(query), 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sPaul+Revere+Mall%2C+Boston%2C+MA+02113!6i16');
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
