// Design tokens. The palette comes from the CheckPoint welcome design: a confident blue,
// deep navy text, soft blue tints, and small purple and green accents.
// Contrast was checked against WCAG 2.2: text >= 4.5:1, borders/icons/chart marks >= 3:1.
export const colors = {
  primary: '#2563EB', // brand blue (white text on it = 5.2:1)
  primaryDark: '#1D4ED8', // blue for text and icons on white or tint (6.7:1 on white)
  primarySoft: '#E8F0FE', // soft blue tint for cards, chips and selected states
  bg: '#F8FAFC', // page background
  card: '#FFFFFF',
  text: '#14213D', // deep navy (15:1 on bg)
  muted: '#5B6B82', // slate for captions (5.2:1 on bg)
  border: '#7A889E', // inputs and outlines (3.6:1 on white, 3.4:1 on bg)
  divider: '#E2E8F0',
  accent: '#5B3FA0', // purple accent text (6.8:1 on accentSoft), used for tips
  accentSoft: '#F1ECFA',
  green: '#1F7A66', // small positive accent (Private / Reset in the welcome design)
  greenSoft: '#E7F5F1',
  support: '#E8F0FE', // quiet, non-alarming surface for Support
  supportText: '#1E3A8A',
  danger: '#B42318', // only used for the delete confirmation, never for missed days
};

// 8 pt spacing grid
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

// A single typeface (system) with a small set of sizes
export const type = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text },
  h2: { fontSize: 20, fontWeight: '700', color: colors.text },
  h3: { fontSize: 17, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, lineHeight: 24, color: colors.text },
  caption: { fontSize: 14, lineHeight: 20, color: colors.muted },
};

// Minimum touch target (WCAG 2.5.8 asks for 24; we use 44 as in the Hi-Fi design)
export const MIN_TARGET = 44;
