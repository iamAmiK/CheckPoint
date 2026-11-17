import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Body, Caption } from '../components/Layout';
import Button from '../components/Button';
import { useApp } from '../store/AppContext';
import { ACTIONS } from '../services/actions';
import { toKey, formatTimer } from '../utils/dates';
import { colors, type } from '../theme';

// Guided small action: intro -> guided steps with a timer -> calm finish.
// "Not now" simply closes it. Nothing is said and the weekly count is not touched.
export default function SmallActionScreen({ navigation, route }) {
  const { dispatch } = useApp();
  const action = ACTIONS.find((a) => a.id === route.params?.id) || ACTIONS[0];
  const [phase, setPhase] = useState('intro'); // 'intro' | 'running' | 'done'
  const [left, setLeft] = useState(action.minutes * 60);

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && left <= 0) finish();
  }, [left, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => {
    dispatch({ type: 'ACTION_STATUS', id: action.id, date: toKey(), status: 'done' });
    setPhase('done');
  };

  const dismiss = () => {
    dispatch({ type: 'ACTION_STATUS', id: action.id, date: toKey(), status: 'dismissed' });
    navigation.goBack();
  };

  if (phase === 'done') {
    return (
      <Screen contentStyle={{ alignItems: 'center', paddingTop: 48 }}>
        <Ionicons name="leaf" size={56} color={colors.primary} />
        <Text style={[type.h2, { marginVertical: 12 }]} accessibilityLiveRegion="polite">Nicely done</Text>
        <Body style={{ textAlign: 'center', marginBottom: 24 }}>That is all. Take a moment before you carry on.</Body>
        <Button title="Done" style={{ alignSelf: 'stretch' }} onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={type.h2} accessibilityRole="header">{action.title}</Text>
        <Caption style={{ marginBottom: 8 }}>{action.minutes} minutes. {action.reason}</Caption>
        {action.steps.map((s, i) => (
          <View key={s} style={{ flexDirection: 'row', marginVertical: 4 }}>
            <Text style={[type.body, { width: 24, fontWeight: '700' }]}>{i + 1}.</Text>
            <Body style={{ flex: 1 }}>{s}</Body>
          </View>
        ))}
      </Card>

      {phase === 'intro' ? (
        <>
          <Button title="Start" onPress={() => setPhase('running')} />
          <Button title="Not now" variant="ghost" onPress={dismiss} />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 48, fontWeight: '700', textAlign: 'center', color: colors.text, marginVertical: 12 }} accessibilityLabel={`${left} seconds left`}>
            {formatTimer(Math.max(0, left))}
          </Text>
          <Button title="Finish early" variant="secondary" onPress={finish} />
        </>
      )}
    </Screen>
  );
}
