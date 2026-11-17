import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Heading, Body, Caption } from '../components/Layout';
import Button from '../components/Button';
import { useApp } from '../store/AppContext';
import { useDerived } from '../hooks/useDerived';
import { orderedActions } from '../services/actions';
import { addDays } from '../utils/dates';
import { colors, type } from '../theme';

// Home is a "bento box" of four cards: Check in, physical summary, weekly progress, small action.
// Cards are glanceable shortcuts. They never rank or score the user.
export default function HomeScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const d = useDerived();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = state.settings.name ? `, ${state.settings.name}` : '';

  // Latest sleep and activity (today, otherwise yesterday)
  const yesterday = addDays(d.today, -1);
  const sleep = state.sleep[d.today] ?? state.sleep[yesterday];
  const activity = state.activity[d.today] ?? state.activity[yesterday];

  // Next suggested action that has not been handled today
  const handled = state.actions.filter((a) => a.date === d.today).map((a) => a.id);
  const next = orderedActions(d.latest).find((a) => !handled.includes(a.id));
  const doneToday = state.actions.some((a) => a.date === d.today && a.status === 'done');

  return (
    <Screen>
      <Heading style={{ fontSize: 24 }}>{greeting}{name}</Heading>

      {d.welcomeBack && (
        <Card tone="soft">
          <Text style={type.h3}>Welcome back</Text>
          <Body>Good to see you. There is nothing to catch up on, one Check in is plenty.</Body>
        </Card>
      )}

      {/* 1. Check in: recording starts in one tap */}
      <Card>
        <Text style={type.h3}>How are you today?</Text>
        <Caption style={{ marginBottom: 12 }}>Say it out loud or type it. It takes about a minute.</Caption>
        <Button title="Record a note" icon="mic" onPress={() => navigation.navigate('Record')} hint="Starts recording right away" />
        <Button title="Type instead" variant="ghost" onPress={() => navigation.navigate('TypeNote')} />
      </Card>

      <View style={styles.row}>
        {/* 2. Physical summary */}
        <Card style={styles.half}>
          <Text style={type.h3}>Body</Text>
          {sleep != null || activity != null ? (
            <>
              <Body>Sleep: {sleep != null ? `${sleep} h` : 'not added'}</Body>
              <Body>Activity: {activity != null ? `${activity} min` : 'not added'}</Body>
            </>
          ) : (
            <Caption>No sleep or activity yet.</Caption>
          )}
          <Button
            title={sleep != null || activity != null ? 'Update' : 'Add'}
            variant="ghost"
            onPress={() => navigation.navigate('HealthConnections')}
          />
        </Card>

        {/* 3. Weekly progress (days out of seven, never a streak) */}
        <Card style={styles.half}>
          <Text style={type.h3}>This week</Text>
          <Text style={styles.big} accessibilityLabel={`${d.keptCount} of 7 days`}>{d.keptCount} of 7</Text>
          <Caption>days. Rest days count.</Caption>
          <Button title="See week" variant="ghost" onPress={() => navigation.navigate('Rhythm')} />
        </Card>
      </View>

      {/* 4. Small action: a suggestion, never a task */}
      <Card>
        <Text style={type.h3}>A small action</Text>
        {next ? (
          <>
            <Body style={{ marginTop: 4 }}>{next.title} ({next.minutes} min)</Body>
            <Caption style={{ marginBottom: 12 }}>{next.reason}</Caption>
            <Button title="Try it" onPress={() => navigation.navigate('SmallAction', { id: next.id })} />
            {/* Dismissing is silent: no message, and the weekly count is untouched */}
            <Button
              title="Not today"
              variant="ghost"
              onPress={() => dispatch({ type: 'ACTION_STATUS', id: next.id, date: d.today, status: 'dismissed' })}
            />
          </>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {doneToday && <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginRight: 8 }} />}
            <Body style={{ flex: 1 }}>That is enough for today.</Body>
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  big: { fontSize: 26, fontWeight: '700', color: colors.primaryDark, marginVertical: 4 },
});
