import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, space, radius, type, MIN_TARGET } from '../theme';

// Scrolling page with consistent padding. Layout uses flexible heights so text can grow to 200%.
export function Screen({ children, style, contentStyle }) {
  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: colors.bg }, style]}
      contentContainerStyle={[{ padding: space.md, paddingBottom: space.xl }, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

// Gestalt common region: related content sits inside one card.
export function Card({ children, style, tone }) {
  return (
    <View
      style={[
        styles.card,
        tone === 'support' && { backgroundColor: colors.support, borderColor: colors.support },
        tone === 'soft' && { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export const Heading = ({ children, style }) => (
  <Text accessibilityRole="header" style={[type.h2, { marginBottom: space.sm }, style]}>{children}</Text>
);

export const Body = ({ children, style }) => <Text style={[type.body, style]}>{children}</Text>;
export const Caption = ({ children, style }) => <Text style={[type.caption, style]}>{children}</Text>;

// A tappable list row with chevron, used in More and Support lists.
export function ListRow({ icon, title, subtitle, onPress, last }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      style={({ pressed }) => [styles.row, !last && styles.rowDivider, pressed && { backgroundColor: colors.primarySoft }]}
    >
      {icon ? <Ionicons name={icon} size={22} color={colors.primaryDark} style={{ marginRight: 14 }} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={type.h3}>{title}</Text>
        {subtitle ? <Text style={type.caption}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: space.md,
  },
  row: {
    minHeight: MIN_TARGET + 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
});
