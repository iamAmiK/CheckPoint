import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Screen, Card, Body, Caption } from '../components/Layout';
import Button from '../components/Button';
import Tip from '../components/Tip';
import { SleepMoodChart } from '../components/Charts';
import { RangeToggle } from './InsightsScreen';
import { useApp } from '../store/AppContext';
import { METRICS } from '../data/metrics';
import { sleepComparison, sleepHeadline, basisLine, dailySeries } from '../services/insights';
import { lastNDays } from '../utils/dates';
import { colors, radius, type, MIN_TARGET } from '../theme';

// Sleep insights (C5): compares nights under 6 hours with other nights.
// Wording describes a PATTERN ("your mood was lower"), never a cause, and says so in plain words.
export default function SleepInsightsScreen({ navigation }) {
  const { state } = useApp();
  const [range, setRange] = useState(30);
  const [metric, setMetric] = useState('mood');
  const [showHow, setShowHow] = useState(false);

  const days = lastNDays(range);
  const cmp = sleepComparison(state.checkIns, state.sleep, metric, days);
  const headline = sleepHeadline(cmp, metric);
  const basis = basisLine(state.checkIns, state.sleep, days);

  // Mood per day for the overlay dots
  const moodByDay = {};
  dailySeries(state.checkIns, 'mood', days).forEach((s) => { if (s.value != null) moodByDay[s.day] = s.value; });
  const summary = cmp.enough
    ? `${headline} Average ${metric} was ${cmp.shortAvg} on short nights and ${cmp.restAvg} on other nights.`
    : 'Not enough data to compare yet.';

  return (
    <Screen>
      <Tip id="sleep" text="Tap “How we worked this out” under the chart to see exactly how this was calculated." />
      <RangeToggle range={range} onChange={setRange} />

      <View style={styles.chips}>
        {['mood', 'stress', 'energy'].map((m) => (
          <Pressable
            key={m}
            onPress={() => setMetric(m)}
            accessibilityRole="button"
            accessibilityState={{ selected: metric === m }}
            style={[styles.chip, metric === m && styles.chipOn]}
          >
            <Text style={[styles.chipText, metric === m && { color: '#FFFFFF' }]}>{METRICS[m].label}</Text>
          </Pressable>
        ))}
      </View>

      <Card>
        {cmp.enough ? (
          <>
            <Text style={type.h2} accessibilityRole="header">{headline}</Text>
            <Body style={{ marginTop: 6 }}>
              Average {METRICS[metric].label.toLowerCase()}: {cmp.shortAvg} on short nights, {cmp.restAvg} on other nights (out of 5).
            </Body>
            <Body style={{ fontWeight: '600', color: colors.primaryDark, marginTop: 6 }}>{basis}</Body>
            <Caption style={{ marginTop: 4 }}>This shows a pattern, not a cause. Many things affect how you feel.</Caption>
          </>
        ) : (
          <>
            <Text style={type.h2} accessibilityRole="header">Not enough data yet</Text>
            <Body style={{ marginVertical: 6 }}>
              To compare, we need at least 3 short nights (under 6 hours) and 3 longer nights that also have a Check in.
              You have {cmp.shortDays} short and {cmp.restDays} longer so far.
            </Body>
            <Button title="Add sleep" variant="secondary" onPress={() => navigation.navigate('HealthConnections')} />
          </>
        )}
      </Card>

      <Card>
        <SleepMoodChart days={days} sleep={state.sleep} moodByDay={moodByDay} summary={summary} />
        {/* Clearer link text for the data note (beta change 3) */}
        <Pressable
          onPress={() => setShowHow((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: showHow }}
          style={{ minHeight: MIN_TARGET, justifyContent: 'center', marginTop: 8 }}
        >
          <Text style={styles.link}>{showHow ? 'Hide: How we worked this out' : 'How we worked this out'}</Text>
        </Pressable>
        {showHow && (
          <Caption>
            We split the days in this period into nights with under 6 hours of sleep and nights with 6 hours or more.
            For each group we average the ratings from your Check ins. Days with no sleep or no Check in are left out.
          </Caption>
        )}
      </Card>

      <Card tone="soft">
        <Text style={type.h3}>Why sleep and mood may move together</Text>
        <Body style={{ marginVertical: 6 }}>
          Rest and mood often shift at the same time, but one does not simply cause the other. Notice your own pattern and be kind to yourself.
        </Body>
        <Button title="Try a 5 minute wind-down" variant="secondary" onPress={() => navigation.navigate('SmallAction', { id: 'winddown' })} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    minHeight: MIN_TARGET, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.pill,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  chipText: { fontSize: 15, fontWeight: '500', color: colors.text },
  link: { color: colors.primaryDark, fontWeight: '600', fontSize: 16, textDecorationLine: 'underline' },
});
