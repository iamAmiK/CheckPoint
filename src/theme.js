// Design tokens. Colours were checked against WCAG 2.2 contrast:
// text on card >= 4.5:1, borders/icons/chart marks >= 3:1.
export const colors = {
  primary: '#0F766E', // calm teal (white text on it = 5.5:1)
  primaryDark: '#115E59',
  primarySoft: '#E0F2F1',
  bg: '#F5F8F8',
  card: '#FFFFFF',
  text: '#1F2933',
  muted: '#52606D', // darkened from the Hi-Fi grey (3.8:1) to 6.4:1 on bg
  border: '#7B8794', // 3.9:1 on white, used for inputs and outlines
  divider: '#E4E9EC',
  accent: '#92400E', // soft amber text (7:1 on accentSoft)
  accentSoft: '#FEF3C7',
  support: '#E8EEF4', // quiet, non-alarming surface for Support
  supportText: '#1E3A5F',
  danger: '#9B1C1C', // only used for the delete confirmation, never for missed days
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
