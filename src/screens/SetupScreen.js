import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { Card, Heading, Body } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { colors, type, space } from '../theme';

// Welcome and Setup: 4 screens at most, skippable on every screen, no permissions asked up front (HF1).
const STEPS = [
  {
    icon: 'leaf-outline',
    title: 'A quick check in on how you are',
    body: 'CheckPoint helps you notice your stress, sleep and mood. It takes about a minute and there is nothing to keep up.',
    points: ['Speak or type a short note', 'No streaks, no scores', 'Skip any day, any time'],
  },
  {
    icon: 'git-network-outline',
    title: 'How it works',
    body: 'You say how you feel. CheckPoint suggests ratings, and you decide what is saved.',
    points: ['1. Speak or type a note', '2. Review and change the suggestions', '3. See patterns over time'],
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Your voice and your data',
    body: 'AI turns your note into text. The audio is deleted straight after, and your notes stay on this phone. We only ask for permissions when a feature needs them.',
    points: ['You can export or delete your data any time', 'Find this again under More > Privacy'],
  },
  {
    icon: 'moon-outline',
    title: 'Sleep and activity (optional)',
    body: 'Add these later from More if you want to see how they link to your mood. You do not need a wearable.',
    points: ['Connect a health app, or add by hand', 'Totally optional'],
  },
];

export default function SetupScreen() {
  const { dispatch, justOnboarded } = useApp();
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  // Finishing (or skipping) lands on the Check in tab so the first note is ready to record
  const finish = () => {
    justOnboarded.current = true;
    dispatch({ type: 'SET_SETTINGS', payload: { onboarded: true } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Text
          style={type.caption}
          accessibilityLabel={`Step ${step + 1} of ${STEPS.length}`}
          accessibilityLiveRegion="polite"
        >
          {step + 1} of {STEPS.length}
        </Text>
        <Button title="Skip" variant="ghost" onPress={finish} hint="Skips setup and goes to your first Check in" />
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name={s.icon} size={44} color={colors.primaryDark} />
        </View>
        <Heading style={{ fontSize: 26, textAlign: 'center' }}>{s.title}</Heading>
        <Body style={{ textAlign: 'center', marginBottom: space.md }}>{s.body}</Body>
        <Card style={{ alignSelf: 'stretch' }}>
          {s.points.map((p) => (
            <Text key={p} style={[type.body, { marginVertical: 4 }]}>{p}</Text>
          ))}
        </Card>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotOn]} />
          ))}
        </View>
        <Button title={last ? 'Get started' : 'Next'} onPress={last ? finish : () => setStep(step + 1)} />
        {step > 0 && <Button title="Back" variant="ghost" onPress={() => setStep(step - 1)} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, padding: space.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  bottom: { paddingBottom: space.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: space.md },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.border, marginHorizontal: 4 },
  dotOn: { backgroundColor: colors.primary, borderColor: colors.primary, width: 22 },
});
