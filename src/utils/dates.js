// Small date helpers. All days are local "YYYY-MM-DD" strings so they are easy to store and compare.
const pad = (n) => String(n).padStart(2, '0');

export const toKey = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key, n) => {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
};

// Oldest first, ending today: lastNDays(7) -> [6 days ago ... today]
export const lastNDays = (n, today = toKey()) =>
  Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));

export const daysBetween = (a, b) =>
  Math.round((fromKey(b) - fromKey(a)) / 86400000);

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const dayShort = (key) => DAY_NAMES[fromKey(key).getDay()];
export const dayLetter = (key) => dayShort(key)[0];

export const formatHour = (h) => {
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:00 ${suffix}`;
};

export const formatTimer = (seconds) =>
  `${Math.floor(seconds / 60)}:${pad(seconds % 60)}`;
