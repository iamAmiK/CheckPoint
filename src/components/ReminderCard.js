import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Card } from './Layout';
import Stepper from './Stepper';
import { useApp } from '../store/AppContext';
import { formatHour } from '../utils/dates';
import { colors, type } from '../theme';

// Reminder choice used on Rhythm and under More > Notifications. It is a gentle nudge, can be turned off,
// and never mentions missed days.
export default function ReminderCard() {
  const { state, dispatch } = useApp();
  const { reminderOn, reminderHour } = state.settings;
  const set = (payload) => dispatch({ type: 'SET_SETTINGS', payload });
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={[type.h3, { flex: 1 }]} accessibilityRole="header">Daily reminder</Text>
        <Switch
          value={reminderOn}
          onValueChange={(v) => set({ reminderOn: v })}
          trackColor={{ false: colors.border, true: colors.primary }}
          accessibilityLabel="Daily reminder"
        />
      </View>
      <Text style={[type.caption, { marginBottom: 12 }]}>
        {reminderOn ? 'A quiet nudge at the time you choose.' : 'Off. You will not get reminders.'}
      </Text>
      {reminderOn && (
        <Stepper label="Reminder time" value={reminderHour} onChange={(h) => set({ reminderHour: h })} min={6} max={22} format={formatHour} />
      )}
      <Text style={type.caption}>
        Beta note: your choice is saved, but phone notifications are switched on in the next release.
      </Text>
    </Card>
  );
}
