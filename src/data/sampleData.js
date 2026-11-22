// Demo data so testers can see Insights straight away (clearly labelled "demo" in the UI).
import { lastNDays, addDays, toKey } from '../utils/dates';

// Small seeded random generator so the demo data is the same every time.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function makeSampleData(today = toKey()) {
  const rand = rng(42);
  const days = lastNDays(30, addDays(today, -1)); // ends yesterday so "today" is free to check in
  const checkIns = [];
  const sleep = {};
  const activity = {};

  days.forEach((day, i) => {
    // Short nights fall on a fixed schedule (every third day) instead of by chance, so every
    // 7 and 30 day window has enough short AND longer nights for a pattern to be detected.
    const shortNight = i % 3 === 1;
    sleep[day] = shortNight
      ? (rand() < 0.5 ? 5 : 5.5) // under 6 hours
      : Math.round((6.5 + rand() * 2) * 2) / 2; // 6.5 to 8.5 hours
    activity[day] = Math.round((10 + rand() * 50) / 5) * 5;
    if (i % 6 === 5) return; // a few rest days with no Check in (never more than one per week)
    const lowSleep = sleep[day] < 6;
    // Built-in pattern for the demo: short nights go with lower mood and higher stress
    const mood = Math.max(1, Math.min(5, Math.round((lowSleep ? 2.6 : 3.9) + (rand() - 0.5) * 1.4)));
    const stress = Math.max(1, Math.min(5, Math.round((lowSleep ? 4 : 2.6) + (rand() - 0.5) * 1.4)));
    const energy = Math.max(1, Math.min(5, Math.round((lowSleep ? 2.4 : 3.6) + (rand() - 0.5) * 1.4)));
    checkIns.push({
      id: `demo-${day}`,
      date: day,
      createdAt: `${day}T18:00:00.000Z`,
      text: 'Demo Check in',
      mood,
      stress,
      energy,
      phrases: {},
      source: 'demo',
      demo: true,
    });
  });
  return { checkIns, sleep, activity };
}