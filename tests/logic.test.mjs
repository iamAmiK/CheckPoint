// Logic tests for the pure services (run with: npm test). They do not need a phone.
import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestRatings, showsDistress } from '../src/services/suggest.js';
import { sleepComparison, sleepHeadline, basisLine, stressHeadline, daysWithCheckIns, MIN_DAYS } from '../src/services/insights.js';
import { makeSampleData } from '../src/data/sampleData.js';
import { lastNDays, addDays, toKey, daysBetween } from '../src/utils/dates.js';

test('suggestions come with the words that caused them', () => {
  const r = suggestRatings('I felt stressed about my deadline and tired');
  assert.ok(r.stress.value >= 4);
  assert.deepEqual(r.stress.phrases.sort(), ['deadline', 'stressed']);
  assert.ok(r.energy.value <= 2);
});

test('no evidence means no guess', () => {
  const r = suggestRatings('I went to the shops');
  assert.equal(r.mood, null);
  assert.equal(r.stress, null);
  assert.equal(r.energy, null);
});

test('negation flips a suggestion', () => {
  const r = suggestRatings('I am not stressed today');
  assert.ok(r.stress.value <= 2);
});

test('distress phrases are detected', () => {
  assert.equal(showsDistress("I can't cope any more"), true);
  assert.equal(showsDistress('lovely day'), false);
});

test('date helpers', () => {
  const days = lastNDays(7, '2026-11-17');
  assert.equal(days.length, 7);
  assert.equal(days[6], '2026-11-17');
  assert.equal(days[0], '2026-11-11');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(daysBetween('2026-11-14', '2026-11-17'), 3);
});

test('demo data gives enough days and a short-sleep pattern', () => {
  const today = toKey();
  const { checkIns, sleep } = makeSampleData(today);
  const days = lastNDays(30);
  assert.ok(daysWithCheckIns(checkIns, days) >= MIN_DAYS);
  const cmp = sleepComparison(checkIns, sleep, 'mood', days);
  assert.equal(cmp.enough, true);
  assert.ok(cmp.diff < 0, 'mood should be lower on short nights in the demo data');
  assert.match(sleepHeadline(cmp, 'mood'), /your mood was lower/);
  assert.match(stressHeadline(checkIns, sleep, days), /stress was higher/);
  assert.match(basisLine(checkIns, sleep, days), /^Based on \d+ Check ins? and \d+ nights? of sleep$/);
});

test('not enough data is reported, not guessed', () => {
  const cmp = sleepComparison([], {}, 'mood', lastNDays(7));
  assert.equal(cmp.enough, false);
  assert.equal(sleepHeadline(cmp, 'mood'), null);
});
