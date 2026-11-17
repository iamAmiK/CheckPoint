import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type } from '../theme';

// Tap-only number input (no keyboard, no gestures) for sleep hours, minutes and reminder time.
export default function Stepper({ label, value, onChange, step = 1, min = 0, max = 24, format = String }) {
  const set = (v) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <View style={styles.wrap}>
      <Text style={type.h3}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          style={styles.btn}
          onPress={() => set(value - step)}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <Ionicons name="remove" size={24} color={colors.primaryDark} />
        </Pressable>
        <Text style={styles.value} accessibilityLiveRegion="polite" accessibilityLabel={`${label}: ${format(value)}`}>
          {format(value)}
        </Text>
        <Pressable
          style={styles.btn}
          onPress={() => set(value + step)}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Ionicons name="add" size={24} color={colors.primaryDark} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  value: { minWidth: 110, textAlign: 'center', fontSize: 22, fontWeight: '700', color: colors.text },
});
