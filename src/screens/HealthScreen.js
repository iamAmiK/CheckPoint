import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Card, Body, Caption } from '../components/Layout';
import Button from '../components/Button';
import Stepper from '../components/Stepper';
import Tip from '../components/Tip';
import { useApp } from '../store/AppContext';
import { makeSampleData } from '../data/sampleData';
import { toKey } from '../utils/dates';
import { colors, type } from '../theme';

// Health connections (C6): "Connect" and "Add by hand" sit side by side on ONE screen so nobody
// takes a wrong turn between them. Both routes write to the same record. Skipping is silent.
export default function HealthScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const today = toKey();
  const [mode, setMode] = useState('hand'); // no wearable needed, so "by hand" is the default
  const [sleepH, setSleepH] = useState(state.sleep[today] ?? 7);
  const [mins, setMins] = useState(state.activity[today] ?? 30);
  const [status, setStatus] = useState('');

  const connect = () => {
    // Beta: imports 14 days of demo sleep and activity instead of talking to a real health app
    const demo = makeSampleData();
    const keep = (obj) => Object.fromEntries(Object.entries(obj).slice(-14));
    dispatch({ type: 'CONNECT_HEALTH', sleep: keep(demo.sleep), activity: keep(demo.activity) });
    setStatus('Connected. Sleep and activity were added to your record.');
  };

  const saveByHand = () => {
    dispatch({ type: 'SET_SLEEP', date: today, hours: sleepH });
    dispatch({ type: 'SET_ACTIVITY', date: today, minutes: mins });
    setStatus('Saved to your record.');
  };

  return (
    <Screen>
      <Tip id="health" text="Two ways to add sleep and activity: connect a health app, or add it by hand. Both end up in the same place." />

      <View style={styles.row}>
        <Card style={[styles.half, mode === 'connect' && styles.on]}>
          <Text style={type.h3}>Connect</Text>
          <Caption style={{ marginVertical: 6 }}>Use a health app on your phone.</Caption>
          <Button title="Connect (demo)" variant="secondary" onPress={() => { setMode('connect'); connect(); }} />
        </Card>
        <Card style={[styles.half, mode === 'hand' && styles.on]}>
          <Text style={type.h3}>Add by hand</Text>
          <Caption style={{ marginVertical: 6 }}>No wearable needed.</Caption>
          <Button title="Add by hand" variant="secondary" onPress={() => { setMode('hand'); setStatus(''); }} />
        </Card>
      </View>

      {mode === 'hand' && (
        <Card>
          <Text style={type.h3} accessibilityRole="header">Today</Text>
          <Stepper label="Sleep last night" value={sleepH} onChange={setSleepH} step={0.5} min={0} max={14} format={(v) => `${v} h`} />
          <Stepper label="Activity today" value={mins} onChange={setMins} step={5} min={0} max={300} format={(v) => `${v} min`} />
          <Button title="Save" onPress={saveByHand} />
        </Card>
      )}

      {status ? (
        <Body accessibilityLiveRegion="polite" style={{ color: colors.primaryDark, fontWeight: '600', marginBottom: 8 }}>{status}</Body>
      ) : null}

      {state.healthConnected && <Caption>A health app is connected (demo).</Caption>}
      {/* Skipping is always fine and shows no message */}
      <Button title="Skip for now" variant="ghost" onPress={() => navigation.goBack()} />
      <Caption style={{ textAlign: 'center' }}>Beta: "Connect" imports sample data instead of using a real health app.</Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  on: { borderColor: colors.primary, borderWidth: 2 },
});
