import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Screen, Card, Body, Caption, ListRow } from '../components/Layout';
import Button from '../components/Button';
import Tip from '../components/Tip';
import { BarChart } from '../components/Charts';
import { useApp } from '../store/AppContext';
import { METRICS } from '../data/metrics';
import {
  MIN_DAYS, dailySeries, activitySeries, daysWithCheckIns, basisLine, stressHeadline, seriesSummary,
} from '../services/insights';
import { lastNDays } from '../utils/dates';
import { colors, radius, type, MIN_TARGET } from '../theme';

const TRENDS = ['mood', 'stress', 'energy', 'activity'];

export function RangeToggle({ range, onChange }) {
  return (
    <View style={styles.toggle} accessibilityRole="tablist">
      {[7, 30].map((n) => (
        <Pressable
          key={n}
          onPress={() => onChange(n)}
          accessibilityRole="tab"
          accessibilityState={{ selected: range === n }}
          accessibilityLabel={`Last ${n} days`}
          style={[styles.toggleBtn, range === n && styles.toggleOn]}
        >
          <Text style={[styles.toggleText, range === n && { color: '#FFFFFF' }]}>{n} days</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Insights is a filtered view of one data set (7 or 30 days). Every insight states what it is
// based on and has a labelled "Not right" button (C4, beta fix for the missed "based on" line).
export default function InsightsScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [range, setRange] = useState(30); // 30 days gives enough data for a pattern
  const [trend, setTrend] = useState('mood');

  const days = lastNDays(range);
  const haveDays = daysWithCheckIns(state.checkIns, lastNDays(30));
  const needed = MIN_DAYS - haveDays;
  const insightKey = `stress-${range}`;
  const hidden = state.hiddenInsights[insightKey];

  // Not enough data yet: say exactly how much more is needed
  if (needed > 0) {
    return (
      <Screen>
        <Card tone="soft">
          <Text style={type.h3} accessibilityRole="header">{needed} more day{needed === 1 ? '' : 's'} needed</Text>
          <Body style={{ marginVertical: 8 }}>
            Insights appear after Check ins on {MIN_DAYS} different days, so they are based on enough to be useful. You have {haveDays} so far.
          </Body>
          <Button title="Check in now" onPress={() => navigation.navigate('CheckIn')} />
          <Button title="Load demo data to preview" variant="ghost" onPress={() => dispatch({ type: 'LOAD_DEMO' })} hint="Adds sample data so you can explore this screen" />
        </Card>
      </Screen>
    );
  }

  const series = trend === 'activity' ? activitySeries(state.activity, days) : dailySeries(state.checkIns, trend, days);
  const label = trend === 'activity' ? 'Activity (minutes)' : METRICS[trend].label;
  const max = trend === 'activity' ? Math.max(60, ...series.map((s) => s.value || 0)) : 5;
  const summary = seriesSummary(series, label, trend === 'activity' ? ' minutes' : ' out of 5');
  const headline = stressHeadline(state.checkIns, state.sleep, days);
  const basis = basisLine(state.checkIns, state.sleep, days);

  return (
    <Screen>
      <Tip id="insights" text="Every insight says what it is based on. If one does not feel right, tap Not right and it will be hidden." />
      <RangeToggle range={range} onChange={setRange} />

      {/* Stress insight */}
      {hidden ? (
        <Card>
          <Body>Thanks. We have hidden this insight.</Body>
          <Button title="Undo" variant="ghost" onPress={() => dispatch({ type: 'SHOW_INSIGHT', key: insightKey })} />
        </Card>
      ) : (
        <Card>
          <Text style={type.caption}>What may affect your stress</Text>
          <Text style={[type.h2, { marginVertical: 6 }]} accessibilityRole="header">{headline}</Text>
          <Body style={{ fontWeight: '600', color: colors.primaryDark }}>{basis}</Body>
          <Caption style={{ marginTop: 4 }}>This shows a pattern, not a cause.</Caption>
          <Button
            title="Not right"
            variant="secondary"
            icon="thumbs-down-outline"
            style={{ marginTop: 12 }}
            onPress={() => dispatch({ type: 'HIDE_INSIGHT', key: insightKey })}
            hint="Hides this insight"
          />
        </Card>
      )}

      {/* Trend chart with a metric picker */}
      <Card>
        <Text style={type.h3} accessibilityRole="header">Trends</Text>
        <View style={styles.chips}>
          {TRENDS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTrend(t)}
              accessibilityRole="button"
              accessibilityState={{ selected: trend === t }}
              style={[styles.chip, trend === t && styles.chipOn]}
            >
              <Text style={[styles.chipText, trend === t && { color: '#FFFFFF' }]}>
                {t === 'activity' ? 'Activity' : METRICS[t].label}
              </Text>
            </Pressable>
          ))}
        </View>
        <BarChart series={series} max={max} label={label} summary={summary} showValues={range === 7 && trend !== 'activity'} />
        <Caption style={{ marginTop: 8 }}>{summary}</Caption>
      </Card>

      <Card style={{ paddingVertical: 0 }}>
        <ListRow icon="moon-outline" title="Sleep and mood" subtitle="See how nights of sleep line up with how you feel" onPress={() => navigation.navigate('SleepInsights')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', backgroundColor: colors.primarySoft, borderRadius: radius.pill, padding: 4, marginBottom: 16 },
  toggleBtn: { flex: 1, minHeight: MIN_TARGET, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.primary },
  toggleText: { fontSize: 16, fontWeight: '600', color: colors.primaryDark },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  chip: {
    minHeight: MIN_TARGET, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.pill,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  chipText: { fontSize: 15, fontWeight: '500', color: colors.text },
});
