// The pasta atlas drawings and the region tile map.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { allDishes, specials } from '../content/menu.ts';
import { wines } from '../content/wine.ts';
import { PASTA_SHAPES, pastaPlate } from '../lib/pasta-shapes.ts';
import { MAP_COLUMNS, MAP_ROWS, REGION_IDS, REGIONS, region, sortRegions } from '../lib/regions.ts';

const PATH = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;

test('every pasta shape renders a drawing', () => {
  for (const shape of PASTA_SHAPES) {
    const plate = pastaPlate(shape);
    assert.ok(plate.name.trim() && plate.meaning.trim(), `${shape}: name and meaning`);
    assert.ok(plate.strokes.length >= 2, `${shape}: draw at least two strokes`);
    assert.match(plate.washPath, PATH, `${shape}: wash path`);
    for (const stroke of plate.strokes) {
      assert.match(stroke.d, PATH, `${shape}: stroke path "${stroke.d.slice(0, 40)}"`);
      assert.doesNotMatch(stroke.d, /NaN|undefined/, `${shape}: stroke has an invalid number`);
    }
  }
});

test('unknown shapes fail with a clear message', () => {
  assert.throws(() => pastaPlate('fettuccine-alfredo'), /Unknown pasta shape "fettuccine-alfredo"\. Use one of: tagliatelle/);
});

test('every dish and special shape has a drawing', () => {
  for (const item of [...allDishes, ...specials]) if (item.shape) assert.doesNotThrow(() => pastaPlate(item.shape!), item.name);
});

test('the tile map has all 20 regions exactly once, each on its own tile', () => {
  assert.equal(REGION_IDS.length, 20);
  assert.equal(REGIONS.length, 20, 'REGIONS must list all 20 regions');
  assert.deepEqual([...REGIONS.map(r => r.id)].sort(), [...REGION_IDS].sort(), 'each region exactly once');
  const cells = REGIONS.map(r => `${r.col},${r.row}`);
  assert.equal(new Set(cells).size, cells.length, 'two regions share a tile');
  for (const r of REGIONS) {
    assert.ok(r.col >= 0 && r.col < MAP_COLUMNS && r.row >= 0 && r.row < MAP_ROWS, `${r.id} is off the map`);
    assert.ok(r.name.trim() && r.short.trim() && r.short.length <= 8, `${r.id}: name and a short label of up to 8 characters`);
  }
});

test('every content region is one of the 20', () => {
  for (const item of [...allDishes, ...wines]) assert.doesNotThrow(() => region(item.region), `${item.id}: region "${item.region}"`);
  for (const special of specials) if (special.region) assert.doesNotThrow(() => region(special.region!), special.name);
  assert.throws(() => region('tuscany'), /Unknown region "tuscany"\. Use one of: valle-d-aosta/);
  assert.deepEqual(sortRegions(['sicilia', 'piemonte', 'toscana']), ['piemonte', 'toscana', 'sicilia']);
});
