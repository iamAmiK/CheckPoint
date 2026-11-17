import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, MIN_TARGET } from '../theme';
import { METRICS } from '../data/metrics';

// One rating on the Review screen (C2, beta change 3).
// - "Suggested by CheckPoint" label and the user's own words make it clear it is a suggestion.
// - "Edit" and "Remove" are labelled buttons (not hidden gestures).
// - If the AI found no evidence there is no guess: the tap scale is shown straight away.
export default function RatingRow({ metric, entry, onChange, onRemove }) {
  const m = METRICS[metric];
  const [open, setOpen] = useState(entry.value == null && !entry.removed);

  const badge =
    entry.value == null
      ? entry.removed ? 'Removed, will not be saved' : 'No feelings mentioned, so no suggestion'
      : entry.source === 'ai' ? 'Suggested by CheckPoint' : 'Edited by you';

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={type.h3}>{m.label}</Text>
        {entry.value != null && (
          <Text style={styles.value} accessibilityLabel={`${m.words[entry.value - 1]}, ${entry.value} of 5`}>
            {m.words[entry.value - 1]} ({entry.value}/5)
          </Text>
        )}
      </View>

      <View style={[styles.badge, entry.source === 'ai' && styles.badgeAi]}>
        {entry.source === 'ai' && <Ionicons name="sparkles-outline" size={14} color={colors.primaryDark} style={{ marginRight: 4 }} />}
        <Text style={styles.badgeText}>{badge}</Text>
      </View>

      {entry.phrases?.length > 0 && entry.source === 'ai' && (
        <Text style={type.caption}>
          Based on your words: {entry.phrases.map((p) => `“${p}”`).join(', ')}
        </Text>
      )}

      {open && (
        <View accessibilityLabel={`${m.label} scale from 1, ${m.low}, to 5, ${m.high}`}>
          <View style={styles.scale}>
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = entry.value === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => onChange(n)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${n}, ${m.words[n - 1]}`}
                  style={[styles.dot, selected && styles.dotOn]}
                >
                  <Text style={[styles.dotText, selected && { color: '#FFFFFF' }]}>{n}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.ends}>
            <Text style={type.caption}>1 {m.low}</Text>
            <Text style={type.caption}>5 {m.high}</Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          style={styles.link}
          onPress={() => setOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityLabel={open ? `Done editing ${m.label}` : `Edit ${m.label}`}
        >
          <Ionicons name={open ? 'checkmark' : 'pencil'} size={16} color={colors.primaryDark} />
          <Text style={styles.linkText}>{open ? 'Done' : 'Edit'}</Text>
        </Pressable>
        {entry.value != null && (
          <Pressable
            style={styles.link}
            onPress={() => { onRemove(); setOpen(false); }}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${m.label} rating`}
          >
            <Ionicons name="close" size={16} color={colors.primaryDark} />
            <Text style={styles.linkText}>Remove</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.divider },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { fontSize: 16, fontWeight: '700', color: colors.primaryDark },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginVertical: 6 },
  badgeAi: { backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 14, color: colors.primaryDark, fontWeight: '600' },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  dot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  dotOn: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  dotText: { fontSize: 18, fontWeight: '700', color: colors.text },
  ends: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  actions: { flexDirection: 'row', marginTop: 4 },
  link: { minHeight: MIN_TARGET, minWidth: MIN_TARGET, flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
  linkText: { color: colors.primaryDark, fontWeight: '600', fontSize: 15, marginLeft: 4 },
});
