import React, { useState } from 'react';
import { Text } from 'react-native';
import { Screen, Card, Body, Caption } from '../components/Layout';
import Button from '../components/Button';
import { useApp } from '../store/AppContext';
import { colors, type } from '../theme';

// Delete data needs a confirmation step (error prevention). The safe choice is the main button.
export default function DeleteDataScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [done, setDone] = useState(false);
  const mine = state.checkIns.filter((c) => !c.demo).length;

  if (done) {
    return (
      <Screen>
        <Card tone="soft">
          <Text style={type.h2} accessibilityRole="header" accessibilityLiveRegion="polite">Your data has been deleted</Text>
          <Body style={{ marginVertical: 8 }}>Everything CheckPoint held on this phone has been removed.</Body>
          <Button title="Back to Home" onPress={() => navigation.navigate('Main', { screen: 'Home' })} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={type.h2} accessibilityRole="header">Delete all your data?</Text>
        <Body style={{ marginVertical: 8 }}>This will permanently remove from this phone:</Body>
        <Body>• {state.checkIns.length} Check in{state.checkIns.length === 1 ? '' : 's'} ({mine} of them your own)</Body>
        <Body>• Sleep and activity you added or connected</Body>
        <Body>• Rest days, small actions and hidden insights</Body>
        <Caption style={{ marginVertical: 8 }}>This cannot be undone. You can export a copy first from More.</Caption>
        <Button title="Keep my data" onPress={() => navigation.goBack()} />
        <Button
          title="Delete everything"
          variant="secondary"
          danger
          style={{ marginTop: 12 }}
          onPress={() => { dispatch({ type: 'DELETE_ALL' }); setDone(true); }}
        />
      </Card>
    </Screen>
  );
}
