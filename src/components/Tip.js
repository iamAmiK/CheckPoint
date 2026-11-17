import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';
import Button from './Button';
import { colors, radius, type } from '../theme';

// Beta change 3: a one-time tip the first time someone opens a screen where testers needed a hint.
export default function Tip({ id, text }) {
  const { state, dispatch } = useApp();
  if (state.settings.seenTips[id]) return null;
  return (
    <View style={styles.box} accessibilityRole="summary">
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="bulb-outline" size={20} color={colors.accent} style={{ marginRight: 8, marginTop: 2 }} />
        <Text style={[type.body, { flex: 1, color: colors.accent }]}>{text}</Text>
      </View>
      <Button title="Got it" variant="ghost" onPress={() => dispatch({ type: 'SEEN_TIP', id })} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: 12, marginBottom: 16 },
});
