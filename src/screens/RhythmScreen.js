import React from 'react';
import { View, Text } from 'react-native';
import { Screen, Card, Body, Caption } from '../components/Layout';
import Button from '../components/Button';
import WeekDots from '../components/WeekDots';
import ReminderCard from '../components/ReminderCard';
import { useApp } from '../store/AppContext';
import { useDerived } from '../hooks/useDerived';
import { colors, type } from '../theme';

// Weekly rhythm: days out of seven. No streaks, nothing turns red, and rest days count (C6).
export default function RhythmScreen() {
  const { state, dispatch } = useApp();
  const d = useDerived();
  const checkedIn = (day) => state.checkIns.some((c) => c.date === day);
  const todayIsRest = !!state.restDays[d.today];

  return (
    <Screen>
      {d.welcomeBack && (
        <Card tone="soft">
          <Text style={type.h3}>Welcome back</Text>
          <Body>Glad you are here. You do not need to make up for anything.</Body>
        </Card>
      )}

      <Card>
        <Text style={type.caption}>This week</Text>
        <Text
          style={{ fontSize: 34, fontWeight: '700', color: colors.primaryDark, marginVertical: 4 }}
          accessibilityLabel={`${d.keptCount} of 7 days`}
        >
          {d.keptCount} of 7 days
        </Text>
        <View style={{ marginVertical: 12 }}>
          <WeekDots days={d.week} checkedIn={checkedIn} restDays={state.restDays} today={d.today} />
        </View>
        {/* Clear answer to "does a rest day count?" (Lo-Fi issue 6) */}
        <Body style={{ fontWeight: '600' }}>Rest days count.</Body>
        <Caption>You do not need to check in every day. Check mark = Check in, moon = rest day.</Caption>
        <Button
          title={todayIsRest ? 'Undo rest day' : 'Mark today as a rest day'}
          variant="secondary"
          style={{ marginTop: 12 }}
          onPress={() => dispatch({ type: 'TOGGLE_REST', date: d.today })}
        />
      </Card>

      <ReminderCard />
    </Screen>
  );
}
