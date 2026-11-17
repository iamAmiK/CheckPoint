import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Screen, Heading, Caption } from '../components/Layout';
import Button from '../components/Button';
import VoiceInfoCard from '../components/VoiceInfoCard';
import { colors, radius, MIN_TARGET } from '../theme';

// Check in tab = the hub of a hub-and-spoke flow. The spokes (record, type, review, saved)
// are full screens with no tab bar so the user can focus while sharing something personal.
export const PROMPTS = ['How was your day?', 'What is on your mind?', 'How did you sleep?', 'What went well today?'];

export default function CheckInScreen({ navigation }) {
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  return (
    <Screen>
      <Heading style={{ fontSize: 24 }}>Check in</Heading>
      <Caption style={{ marginBottom: 12 }}>Pick a prompt if it helps, or just start.</Caption>

      <View style={styles.chips}>
        {PROMPTS.map((p) => (
          <Pressable
            key={p}
            onPress={() => setPrompt(p)}
            accessibilityRole="button"
            accessibilityState={{ selected: prompt === p }}
            style={[styles.chip, prompt === p && styles.chipOn]}
          >
            <Text style={[styles.chipText, prompt === p && { color: '#FFFFFF' }]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <Button title="Speak a note" icon="mic" onPress={() => navigation.navigate('Record', { prompt })} />
      <Button title="Type instead" variant="secondary" icon="create-outline" style={{ marginTop: 12, marginBottom: 20 }} onPress={() => navigation.navigate('TypeNote', { prompt })} />

      <VoiceInfoCard />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    minHeight: MIN_TARGET,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  chipText: { fontSize: 15, color: colors.text, fontWeight: '500' },
});
