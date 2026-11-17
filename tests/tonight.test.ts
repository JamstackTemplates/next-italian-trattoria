// The "tonight" status: pure functions, given a local day and minutes after midnight.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { trattoria } from '../content/trattoria.ts';
import { describeTonight, formatTime, groupedHours, tonightState, toMinutes, zonedNow, type DayHours } from '../lib/hours.ts';

const hours = trattoria.hours;
const at = (day: Parameters<typeof tonightState>[0], time: string) => describeTonight(tonightState(day, toMinutes(time), hours));

test('times format for people', () => {
  assert.equal(formatTime('17:00'), '5pm');
  assert.equal(formatTime('12:00'), '12pm');
  assert.equal(formatTime('21:30'), '9:30pm');
  assert.equal(formatTime('00:00'), '12am');
});

test('weekday dinner: before opening, during service and the last 30 minutes', () => {
  assert.deepEqual(at('Tuesday', '15:00'), { text: 'Open tonight · from 5pm', tone: 'closed' });
  assert.deepEqual(at('Tuesday', '17:00'), { text: 'Open tonight · kitchen until 10pm', tone: 'open' });
  assert.deepEqual(at('Friday', '21:29'), { text: 'Open tonight · kitchen until 10pm', tone: 'open' });
  assert.deepEqual(at('Friday', '21:30'), { text: 'Kitchen closing in 30 minutes', tone: 'soon' });
  assert.deepEqual(at('Friday', '21:59'), { text: 'Kitchen closing in 1 minute', tone: 'soon' });
});

test('after closing points to the next service', () => {
  assert.deepEqual(at('Wednesday', '22:00'), { text: 'Kitchen closed for today · open Thursday from 5pm', tone: 'closed' });
  assert.deepEqual(at('Saturday', '23:15'), { text: 'Kitchen closed for today · open Sunday from 12pm', tone: 'closed' });
});

test('Sunday lunch versus weekday dinner', () => {
  assert.deepEqual(at('Sunday', '11:00'), { text: 'Sunday lunch today · from 12pm', tone: 'closed' });
  assert.deepEqual(at('Sunday', '13:00'), { text: 'Sunday lunch · until 4pm', tone: 'open' });
  assert.deepEqual(at('Sunday', '15:45'), { text: 'Kitchen closing in 15 minutes', tone: 'soon' });
  assert.deepEqual(at('Sunday', '16:00'), { text: 'Kitchen closed for today · open Tuesday from 5pm', tone: 'closed' });
});

test('the closed Monday, and the next opening across it', () => {
  assert.deepEqual(at('Monday', '19:00'), { text: 'Closed today · open Tuesday from 5pm', tone: 'closed' });
  assert.deepEqual(at('Monday', '00:00'), { text: 'Closed today · open Tuesday from 5pm', tone: 'closed' });
  const state = tonightState('Sunday', toMinutes('20:00'), hours);
  assert.equal(state.status, 'finished');
  assert.equal(state.status === 'finished' && state.next?.day, 'Tuesday');
  assert.equal(state.status === 'finished' && state.next?.daysAhead, 2);
});

test('days with two services: lunch, between services, then dinner', () => {
  const twoServices: DayHours[] = [{ day: 'Saturday', services: [
    { label: 'Lunch', opens: '12:00', closes: '15:00' }, { label: 'Dinner', opens: '17:00', closes: '22:00' },
  ] }];
  const say = (time: string) => describeTonight(tonightState('Saturday', toMinutes(time), twoServices)).text;
  assert.equal(say('11:00'), 'Open for lunch today · from 12pm');
  assert.equal(say('13:00'), 'Open for lunch · kitchen until 3pm');
  assert.equal(say('16:00'), 'Between services · dinner from 5pm');
  assert.equal(say('18:00'), 'Open tonight · kitchen until 10pm');
  assert.equal(say('22:30'), 'Kitchen closed for today · open Saturday from 12pm');
  assert.deepEqual(groupedHours(twoServices), [{ label: 'Saturday', services: [
    { label: 'Lunch', hours: '12pm – 3pm' }, { label: 'Dinner', hours: '5pm – 10pm' }] }]);
});

test('no hours at all never claims a next opening', () => {
  assert.deepEqual(describeTonight(tonightState('Tuesday', 600, [])), { text: 'Closed today', tone: 'closed' });
});

test('the current time is read in the trattoria’s own time zone', () => {
  // 2026-01-06 02:30 UTC is Monday 21:30 in New York.
  assert.deepEqual(zonedNow('America/New_York', new Date(Date.UTC(2026, 0, 6, 2, 30))), { day: 'Monday', minutes: 21 * 60 + 30 });
});
