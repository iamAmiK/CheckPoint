import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Screen, Caption } from '../components/Layout';
import Button from '../components/Button';
import { colors, radius, type } from '../theme';

// Typing is a full alternative to speaking (quiet places, speech difficulties, personal choice).
export default function TypeNoteScreen({ navigation, route }) {
  const [text, setText] = useState('');
  const prompt = route.params?.prompt || 'How are you feeling today?';
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <Text style={[type.h3, { marginBottom: 4 }]}>{prompt}</Text>
        <Caption style={{ marginBottom: 12 }}>Write as much or as little as you like.</Caption>
        <Text style={[type.caption, { marginBottom: 4 }]}>Your note</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
          placeholder="For example: I felt tired after lectures but the walk home helped."
          placeholderTextColor={colors.muted}
          accessibilityLabel="Your note"
         
          style={styles.input}
        />
        <Button
          title="Continue"
          disabled={text.trim().length === 0}
          onPress={() => navigation.replace('Review', { text: text.trim(), source: 'text' })}
          hint="Next you can review the suggested ratings"
        />
        <Caption style={{ marginTop: 12 }}>Nothing is saved until you confirm on the next screen.</Caption>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 170,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
});
