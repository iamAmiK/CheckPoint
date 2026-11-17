// Turns saved records into plain-language insights. Everything here describes a
// PATTERN, never a cause (Lo-Fi issue 9), and always reports what it is based on.
import { lastNDays } from '../utils/dates';

export const MIN_DAYS = 7; // days with a Check in before insights appear
const SHORT_SLEEP = 6; // hours; "nights under 6 hours"

const avg = (nums) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null);
const round1 = (n) => Math.round(n * 10) / 10;

// Average of a metric per day (a day can have several Check ins).
export function dailySeries(checkIns, metric, days) {
  return days.map((day) => {
    const vals = checkIns.filter((c) => c.date === day && c[metric] != null).map((c) => c[metric]);
    return { day, value: avg(vals) };
  });
}

export function activitySeries(activity, days) {
  return days.map((day) => ({ day, value: activity[day] ?? null }));
}

// How many distinct days in the window have at least one Check in.
export function daysWithCheckIns(checkIns, days) {
  return days.filter((d) => checkIns.some((c) => c.date === d)).length;
}

export function basisLine(checkIns, sleep, days) {
  const n = checkIns.filter((c) => days.includes(c.date)).length;
  const nights = days.filter((d) => sleep[d] != null).length;
  const parts = [`${n} Check in${n === 1 ? '' : 's'}`];
  if (nights > 0) parts.push(`${nights} night${nights === 1 ? '' : 's'} of sleep`);
  return `Based on ${parts.join(' and ')}`;
}

// Compare a metric on short-sleep nights against other nights.
// Needs at least 3 days on each side, otherwise returns how many more are needed.
export function sleepComparison(checkIns, sleep, metric, days) {
  const short = [];
  const rest = [];
  days.forEach((d) => {
    if (sleep[d] == null) return;
    const vals = checkIns.filter((c) => c.date === d && c[metric] != null).map((c) => c[metric]);
    if (!vals.length) return;
    (sleep[d] < SHORT_SLEEP ? short : rest).push(avg(vals));
  });
  if (short.length < 3 || rest.length < 3) {
    return { enough: false, shortDays: short.length, restDays: rest.length };
  }
  const a = avg(short);
  const b = avg(rest);
  return { enough: true, shortAvg: round1(a), restAvg: round1(b), diff: round1(a - b) };
}

// Headline for the stress insight (HF5): plain language, pattern only.
export function stressHeadline(checkIns, sleep, days) {
  const cmp = sleepComparison(checkIns, sleep, 'stress', days);
  if (!cmp.enough) {
    return 'Not enough sleep and stress data in this period to spot a pattern yet.';
  }
  if (Math.abs(cmp.diff) < 0.3) {
    return 'Your stress looked similar on short and longer nights.';
  }
  return cmp.diff > 0
    ? 'On nights under 6 hours, your stress was higher.'
    : 'On nights under 6 hours, your stress was lower.';
}

// Headline for Sleep insights (HF10, C5): "your mood was lower", never "sleep causes".
// `metric` is mood, stress or energy; stress is the one where "higher" is the harder direction.
export function sleepHeadline(cmp, metric) {
  if (!cmp.enough) return null;
  const noun = metric; // "mood", "stress" or "energy"
  if (Math.abs(cmp.diff) < 0.3) return `Your ${noun} looked similar on short and longer nights.`;
  return `On nights under ${SHORT_SLEEP} hours, your ${noun} was ${cmp.diff < 0 ? 'lower' : 'higher'}.`;
}

// Words for the text summary read by screen readers and shown under charts.
export function seriesSummary(series, label, unit = '') {
  const vals = series.filter((s) => s.value != null).map((s) => s.value);
  if (!vals.length) return `No ${label.toLowerCase()} data in this period.`;
  const a = round1(avg(vals));
  return `${label}: ${vals.length} days with data, average ${a}${unit}.`;
}

export const windowDays = (n) => lastNDays(n);
