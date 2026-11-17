// Derived values used by several screens, kept in one place.
import { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { toKey, lastNDays, daysBetween } from '../utils/dates';

export function useDerived() {
  const { state } = useApp();
  const today = toKey();

  return useMemo(() => {
    const week = lastNDays(7, today);
    const kept = week.filter((d) => state.restDays[d] || state.checkIns.some((c) => c.date === d));
    const sorted = [...state.checkIns].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    const latest = sorted[sorted.length - 1] || null;
    const daysAway = latest ? daysBetween(latest.date, today) : 0;
    return {
      today,
      week,
      keptCount: kept.length,
      isKept: (d) => kept.includes(d),
      latest,
      sortedCheckIns: sorted,
      welcomeBack: latest != null && daysAway >= 3, // friendly message after 3 or more days away
    };
  }, [state.checkIns, state.restDays, today]);
}
