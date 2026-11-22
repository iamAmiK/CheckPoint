import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// The CheckPoint mark: a blue outlined heart on a soft white rounded square,
// with a small curved line under it (the "check in" base).
export function Logo({ size = 72 }) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="CheckPoint logo"
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * 0.3 },
      ]}
    >
      <Ionicons name="heart-outline" size={size * 0.56} color={colors.primary} />
      <View style={[styles.base, { width: size * 0.3, bottom: size * 0.2, height: Math.max(2, size * 0.035) }]} />
    </View>
  );
}

// The wordmark: "Check" in deep navy and "Point" in brand blue, one weight.
export function Wordmark({ size = 24 }) {
  return (
    <Text accessibilityRole="header" accessibilityLabel="CheckPoint" style={{ fontSize: size, fontWeight: '800', letterSpacing: -0.3 }}>
      <Text style={{ color: colors.text }}>Check</Text>
      <Text style={{ color: colors.primary }}>Point</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // soft blue glow like the welcome design (iOS shadow, Android elevation)
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  base: { position: 'absolute', backgroundColor: colors.primary, opacity: 0.35, borderRadius: 4 },
});
