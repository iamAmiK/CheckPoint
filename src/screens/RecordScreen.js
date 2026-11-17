import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, AccessibilityInfo, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Waveform from '../components/Waveform';
import Button from '../components/Button';
import { transcribe } from '../services/transcribe';
import { formatTimer } from '../utils/dates';
import { colors, type, space } from '../theme';

// Recording screen (C3). Always shows what the app is doing: a text status, a timer,
// a live waveform and a large Stop button within thumb reach. Recording starts as soon
// as the screen opens, so it is one tap from Home. Beta: recording and transcription are simulated.
export default function RecordScreen({ navigation, route }) {
  const [phase, setPhase] = useState('recording'); // 'recording' | 'transcribing'
  const [seconds, setSeconds] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    AccessibilityInfo.announceForAccessibility('Recording started');
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    if (phase !== 'recording') return undefined;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const stop = async () => {
    setPhase('transcribing');
    AccessibilityInfo.announceForAccessibility('Recording stopped. Turning your note into text.');
    const text = await transcribe();
    if (alive.current) navigation.replace('Review', { text, source: 'voice' });
  };

  const typeInstead = () => navigation.replace('TypeNote', { prompt: route.params?.prompt });

  return (
    <View style={styles.wrap}>
      <Text style={[type.h3, { textAlign: 'center' }]}>{route.params?.prompt || 'How are you feeling today?'}</Text>

      <View style={styles.middle}>
        <View style={styles.status} accessibilityLiveRegion="polite">
          <Ionicons name={phase === 'recording' ? 'radio-button-on' : 'sync'} size={20} color={colors.primary} />
          <Text style={styles.statusText}>{phase === 'recording' ? 'Recording' : 'Turning your note into text…'}</Text>
        </View>
        <Text style={styles.timer} accessibilityLabel={`${seconds} seconds`}>{formatTimer(seconds)}</Text>
        <Waveform active={phase === 'recording'} />
        <Text style={[type.caption, { textAlign: 'center', marginTop: 12 }]}>
          Demo build: your voice is simulated. Audio would be deleted after it becomes text.
        </Text>
      </View>

      <View style={styles.bottom}>
        {phase === 'recording' ? (
          <>
            <Pressable
              onPress={stop}
              accessibilityRole="button"
              accessibilityLabel="Stop recording"
              style={({ pressed }) => [styles.stop, pressed && { opacity: 0.75 }]}
            >
              <Ionicons name="stop" size={36} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.stopLabel}>Tap to stop</Text>
            <Button title="Type instead" variant="ghost" onPress={typeInstead} hint="Stops recording and lets you type" />
            <Button title="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: space.md },
  middle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  status: { flexDirection: 'row', alignItems: 'center' },
  statusText: { marginLeft: 8, fontSize: 18, fontWeight: '600', color: colors.primaryDark },
  timer: { fontSize: 48, fontWeight: '700', color: colors.text, marginVertical: 12 },
  bottom: { alignItems: 'center', minHeight: 200 },
  stop: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopLabel: { marginTop: 8, marginBottom: 8, fontSize: 15, color: colors.muted },
});
