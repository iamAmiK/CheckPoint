import React, { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { Screen, Card, Body, Caption, ListRow } from '../components/Layout';
import Button from '../components/Button';
import { useApp } from '../store/AppContext';
import { colors, radius, type } from '../theme';

// Account is deliberately small in the beta: just a first name for the greeting.
// It points to "Your data" because a tester looked here for Delete data.
export default function AccountScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.settings.name);
  const [saved, setSaved] = useState(false);

  return (
    <Screen>
      <Card>
        <Text style={[type.h3, { marginBottom: 8 }]}>First name (optional)</Text>
        <TextInput
          value={name}
          onChangeText={(v) => { setName(v); setSaved(false); }}
          accessibilityLabel="First name"
          placeholder="What should we call you?"
          placeholderTextColor={colors.muted}
          maxLength={30}
          style={styles.input}
        />
        <Button title="Save" onPress={() => { dispatch({ type: 'SET_SETTINGS', payload: { name: name.trim() } }); setSaved(true); }} />
        {saved && <Caption accessibilityLiveRegion="polite" style={{ marginTop: 8 }}>Saved.</Caption>}
      </Card>

      <Card tone="soft">
        <Body style={{ marginBottom: 4 }}>Looking to export or delete your data?</Body>
        <ListRow icon="trash-outline" title="Delete my data" onPress={() => navigation.navigate('DeleteData')} />
        <ListRow icon="shield-checkmark-outline" title="Privacy" onPress={() => navigation.navigate('Privacy')} last />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
    marginBottom: 12,
    minHeight: 48,
  },
});
