import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { dayShort, dayLetter } from '../utils/dates';

// Days-out-of-seven view (no streaks). Each day uses an icon AND a style, not colour alone:
// check = checked in, moon = rest day (counts), empty ring = nothing recorded (neutral, never red).
export default function WeekDots({ days, checkedIn, restDays, today }) {
  return (
    <View style={styles.row}>
      {days.map((d) => {
        const checked = checkedIn(d);
        const rest = !checked && restDays[d];
        const state = checked ? 'checked in' : rest ? 'rest day, counts' : 'nothing recorded';
        return (
          <View key={d} style={styles.item} accessible accessibilityLabel={`${dayShort(d)}${d === today ? ' today' : ''}: ${state}`}>
            <View style={[styles.dot, checked && styles.dotOn, rest && styles.dotRest, d === today && styles.today]}>
              {checked && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
              {rest && <Ionicons name="moon" size={18} color={colors.primaryDark} />}
            </View>
            <Text style={styles.letter}>{dayLetter(d)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { alignItems: 'center', flex: 1 },
  dot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  dotOn: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  dotRest: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  today: { borderWidth: 3 },
  letter: { marginTop: 4, fontSize: 14, color: colors.muted },
});
