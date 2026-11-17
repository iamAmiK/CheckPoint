import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, type } from '../theme';
import { dayShort } from '../utils/dates';

const H = 120; // chart height

// Simple bar chart built from Views (no chart library, so nothing extra to install).
// Not colour-only: missing days show a short dash, and 7 day charts print the value on each bar.
// The whole chart has a plain-language label for screen readers (WCAG 1.1.1).
export function BarChart({ series, max, label, summary, showValues }) {
  return (
    <View accessible accessibilityLabel={`${label} chart. ${summary}`}>
      <View style={[styles.plot, { height: H + 18 }]}>
        {series.map((s) => {
          const has = s.value != null;
          const h = has ? Math.max(4, (s.value / max) * H) : 0;
          return (
            <View key={s.day} style={styles.col}>
              {showValues && has ? <Text style={styles.val}>{Math.round(s.value * 10) / 10}</Text> : null}
              {has ? <View style={[styles.bar, { height: h }]} /> : <View style={styles.missing} />}
            </View>
          );
        })}
      </View>
      <Axis series={series} />
      <Text style={[type.caption, { marginTop: 4 }]}>A short dash means no data for that day.</Text>
    </View>
  );
}

// Overlay chart for Sleep insights: bars = hours slept, dots = mood.
// Two different shapes (bar, dot) so it does not rely on colour alone.
export function SleepMoodChart({ days, sleep, moodByDay, summary }) {
  return (
    <View accessible accessibilityLabel={`Sleep and mood chart. ${summary}`}>
      <View style={[styles.plot, { height: H + 18 }]}>
        {days.map((day) => {
          const hrs = sleep[day];
          const mood = moodByDay[day];
          return (
            <View key={day} style={[styles.col, { height: H + 18 }]}>
              {hrs != null ? (
                <View style={[styles.sleepBar, { height: Math.max(4, (hrs / 10) * H) }]} />
              ) : (
                <View style={styles.missing} />
              )}
              {mood != null && (
                <View style={[styles.moodDot, { bottom: 18 + ((mood - 1) / 4) * (H - 10) }]} />
              )}
            </View>
          );
        })}
      </View>
      <Axis series={days.map((d) => ({ day: d }))} />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendBar} />
          <Text style={type.caption}>Bar: hours slept (up to 10)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDot} />
          <Text style={type.caption}>Dot: mood (1 low to 5 good)</Text>
        </View>
      </View>
    </View>
  );
}

function Axis({ series }) {
  if (!series.length) return null;
  return (
    <View style={styles.axis}>
      <Text style={type.caption}>{dayShort(series[0].day)} {series[0].day.slice(5)}</Text>
      <Text style={type.caption}>{dayShort(series[series.length - 1].day)} {series[series.length - 1].day.slice(5)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plot: { flexDirection: 'row', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: colors.border },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 1 },
  bar: { width: '70%', minWidth: 3, backgroundColor: colors.primary, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  sleepBar: {
    width: '70%',
    minWidth: 3,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  missing: { width: '70%', minWidth: 3, height: 2, backgroundColor: colors.border, marginBottom: 1 },
  val: { fontSize: 12, color: colors.text, marginBottom: 2 },
  moodDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  legend: { marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  legendBar: { width: 14, height: 14, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primary, marginRight: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.text, marginRight: 9, marginLeft: 1 },
});
