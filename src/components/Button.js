import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, MIN_TARGET } from '../theme';

// One button component, three looks. Always at least 48 high (>= 44 pt target).
export default function Button({ title, onPress, variant = 'primary', icon, iconRight, disabled, hint, style, danger }) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const fg = isPrimary ? '#FFFFFF' : danger ? colors.danger : colors.primaryDark;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        variant === 'secondary' && [styles.secondary, danger && { borderColor: colors.danger }],
        isGhost && styles.ghost,
        pressed && { opacity: 0.75 }, // visible feedback on every tap
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      <View style={styles.inner}>
        {icon && !iconRight ? <Ionicons name={icon} size={20} color={fg} style={{ marginRight: 8 }} /> : null}
        <Text style={[styles.text, { color: fg }]}>{title}</Text>
        {icon && iconRight ? <Ionicons name={icon} size={20} color={fg} style={{ marginLeft: 8 }} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TARGET + 4,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  text: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
