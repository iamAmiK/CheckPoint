import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Heading, Body } from '../components/Layout';
import Button from '../components/Button';
import { useDerived } from '../hooks/useDerived';
import { colors, type } from '../theme';

// Saved confirmation. A calm support prompt appears ONLY when mood has stayed low across the last
// three Check ins or the note showed serious distress. It never diagnoses or gives advice.
export default function SavedScreen({ navigation, route }) {
  const d = useDerived();
  const lastThree = d.sortedCheckIns.slice(-3).filter((c) => c.mood != null);
  const lowRun = lastThree.length === 3 && lastThree.every((c) => c.mood <= 2);
  const showSupport = route.params?.distress || lowRun;

  return (
    <Screen contentStyle={{ alignItems: 'center', paddingTop: 48 }}>
      <View style={styles.circle}>
        <Ionicons name="checkmark" size={44} color="#FFFFFF" />
      </View>
      <View accessibilityLiveRegion="polite" style={{ alignItems: 'center' }}>
        <Heading style={{ fontSize: 26 }}>Saved</Heading>
        <Body style={{ textAlign: 'center', marginBottom: 24 }}>Thanks for checking in. It is on your Home screen now.</Body>
      </View>

      {showSupport && (
        <Card tone="support" style={{ alignSelf: 'stretch' }}>
          <Text style={[type.h3, { color: colors.supportText }]}>That sounds like a lot</Text>
          <Body style={{ marginVertical: 8 }}>
            You do not have to handle it alone. There are people you can talk to whenever you like.
          </Body>
          <Button title="See support options" variant="secondary" onPress={() => navigation.navigate('Support')} />
        </Card>
      )}

      <Button
        title="Back to Home"
        style={{ alignSelf: 'stretch' }}
        onPress={() => navigation.navigate('Main', { screen: 'Home' })}
      />
      <Button
        title="See your week"
        variant="ghost"
        style={{ alignSelf: 'stretch' }}
        onPress={() => navigation.navigate('Main', { screen: 'Rhythm' })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});
