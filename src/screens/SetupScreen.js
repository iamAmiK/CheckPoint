import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { Card, Heading, Body } from '../components/Layout';
import { Logo, Wordmark } from '../components/Logo';
import { useApp } from '../store/AppContext';
import { colors, type, space, radius } from '../theme';

// Welcome and Setup: 4 screens at most, skippable on every screen, no permissions asked up front (HF1).
// Step 1 is the branded welcome; steps 2 to 4 explain how it works, privacy and optional data.
const STEPS = [
  { key: 'welcome' },
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

// The three promises shown on the welcome screen. Each pairs an icon with a text label.
const PROMISES = [
  { icon: 'mic-outline', label: 'Voice-first', fg: colors.primary, bg: colors.primarySoft },
  { icon: 'shield-outline', label: 'Private', fg: colors.green, bg: colors.greenSoft },
  { icon: 'sparkles-outline', label: 'Supportive', fg: colors.accent, bg: colors.accentSoft },
];

// Small floating labels around the logo (decorative, hidden from screen readers).
const CHIPS = [
  { icon: 'moon-outline', label: 'Rest', fg: colors.accent, style: { left: '6%', top: '38%' } },
  { icon: 'sparkles-outline', label: 'Reflect', fg: colors.primary, style: { right: '6%', top: '18%' } },
  { icon: 'walk-outline', label: 'Reset', fg: colors.green, style: { right: '8%', bottom: '14%' } },
];

function Hero() {
  return (
    <View style={styles.hero}>
      <View style={[styles.blob, styles.blobA]} />
      <View style={[styles.blob, styles.blobB]} />
      {CHIPS.map((c) => (
        <View
          key={c.label}
          style={[styles.chip, c.style]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Ionicons name={c.icon} size={16} color={c.fg} />
          <Text style={[styles.chipText, { color: c.fg }]}>{c.label}</Text>
        </View>
      ))}
      <Logo size={104} />
    </View>
  );
}

export default function SetupScreen() {
  const { dispatch, justOnboarded } = useApp();
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const welcome = step === 0;
  const last = step === STEPS.length - 1;

  // Finishing (or skipping) lands on the Check in tab so the first note is ready to record
  const finish = () => {
    justOnboarded.current = true;
    dispatch({ type: 'SET_SETTINGS', payload: { onboarded: true } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {welcome ? (
          <>
            <Hero />
            <View style={styles.center}>
              <Wordmark size={26} />
              <Text style={styles.headline} accessibilityRole="header">A little space to check in with you.</Text>
              <Body style={styles.sub}>Speak freely, notice patterns, and find small ways to feel more balanced.</Body>
              <View style={styles.promises}>
                {PROMISES.map((p) => (
                  <View key={p.label} style={styles.promise}>
                    <View style={[styles.promiseIcon, { backgroundColor: p.bg }]}>
                      <Ionicons name={p.icon} size={24} color={p.fg} />
                    </View>
                    <Text style={styles.promiseText}>{p.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.center}>
            <Text
              style={[type.caption, { alignSelf: 'flex-end' }]}
              accessibilityLabel={`Step ${step + 1} of ${STEPS.length}`}
              accessibilityLiveRegion="polite"
            >
              {step + 1} of {STEPS.length}
            </Text>
            <View style={styles.iconWrap}>
              <Ionicons name={s.icon} size={44} color={colors.primary} />
            </View>
            <Heading style={{ fontSize: 26, textAlign: 'center' }}>{s.title}</Heading>
            <Body style={{ textAlign: 'center', marginBottom: space.md }}>{s.body}</Body>
            <Card style={{ alignSelf: 'stretch' }}>
              {s.points.map((p) => (
                <Text key={p} style={[type.body, { marginVertical: 4 }]}>{p}</Text>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottom}>
        <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotOn]} />
          ))}
        </View>
        <Button
          title={welcome ? 'Get started' : last ? 'Finish' : 'Next'}
          icon={welcome || !last ? 'chevron-forward' : undefined}
          iconRight
          onPress={last ? finish : () => setStep(step + 1)}
        />
        {step > 0 && <Button title="Back" variant="ghost" onPress={() => setStep(step - 1)} />}
        {/* Skip is on every screen and never asks why */}
        <Button title="Skip setup for now" variant="ghost" onPress={finish} hint="Goes to your first Check in" />
        {welcome && (
          <Text style={styles.reassure}>No pressure. You are always in control of what you share.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  // Hero: soft blue panel with the logo and floating labels, like the welcome design
  hero: {
    height: 280,
    backgroundColor: '#DCE9FD',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  blob: { position: 'absolute', borderRadius: 999 },
  blobA: { width: 260, height: 260, left: -110, top: -90, backgroundColor: '#EAF2FF' },
  blobB: { width: 240, height: 240, right: -90, bottom: -110, backgroundColor: '#D3DFFB' },
  chip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  chipText: { marginLeft: 6, fontSize: 14, fontWeight: '700' },
  center: { padding: space.lg, alignItems: 'center' },
  headline: { fontSize: 30, fontWeight: '500', lineHeight: 38, color: colors.text, textAlign: 'center', marginTop: space.md },
  sub: { textAlign: 'center', color: colors.muted, marginTop: space.sm, fontSize: 17 },
  promises: { flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'stretch', marginTop: space.lg },
  promise: { alignItems: 'center', flex: 1 },
  promiseIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  promiseText: { marginTop: 8, fontSize: 14, fontWeight: '600', color: colors.muted },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: space.md,
  },
  bottom: { paddingHorizontal: space.lg, paddingBottom: space.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: space.sm },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.border, marginHorizontal: 4 },
  dotOn: { backgroundColor: colors.primary, borderColor: colors.primary, width: 22 },
  reassure: { textAlign: 'center', color: colors.muted, fontSize: 14, marginTop: 4 },
});
