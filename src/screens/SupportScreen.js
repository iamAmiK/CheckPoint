import React from 'react';
import { Text, Linking, Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Body, Caption } from '../components/Layout';
import Button from '../components/Button';
import { colors, type } from '../theme';

// Support: warm message, big tap-to-call cards, quiet colours, no diagnosis and no advice.
// Reachable from "Need help?" on every tab. IMPORTANT: confirm these numbers before a public release.
const SERVICES = [
  { name: 'Lifeline', note: '24 hours, 7 days. Talk to someone any time.', phone: '131114', display: '13 11 14' },
  { name: 'Beyond Blue', note: '24 hours, 7 days. Support for stress, anxiety and low mood.', phone: '1300224636', display: '1300 22 4636' },
  { name: 'University counselling (UNSW CAPS)', note: 'Free, confidential support for UNSW students.', phone: '0293855418', display: '(02) 9385 5418' },
];

async function open(url, fallback) {
  try {
    await Linking.openURL(url);
  } catch (e) {
    Alert.alert('Could not open that', fallback);
  }
}

export default function SupportScreen() {
  return (
    <Screen>
      <Card tone="support">
        <Text style={[type.h2, { color: colors.supportText }]} accessibilityRole="header">You are not alone</Text>
        <Body style={{ marginTop: 6 }}>
          If things feel heavy, these are people who are glad to listen. You can reach out at any time.
        </Body>
      </Card>

      {SERVICES.map((s) => (
        <Card key={s.name} tone="support">
          <Text style={[type.h3, { color: colors.supportText }]}>{s.name}</Text>
          <Caption style={{ marginVertical: 4, color: colors.supportText }}>{s.note}</Caption>
          <Button
            title={`Call ${s.display}`}
            icon="call"
            onPress={() => open(`tel:${s.phone}`, `You can call ${s.display} from your phone.`)}
          />
        </Card>
      ))}

      <Card tone="support">
        <Text style={[type.h3, { color: colors.supportText }]}>Contact CheckPoint</Text>
        <Caption style={{ marginVertical: 4, color: colors.supportText }}>Questions about the app or your data.</Caption>
        <Button
          title="Email us"
          icon="mail"
          variant="secondary"
          onPress={() => open('mailto:hello@checkpoint.example', 'Email hello@checkpoint.example')}
        />
      </Card>

      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="alert-circle-outline" size={20} color={colors.supportText} style={{ marginRight: 8, marginTop: 2 }} />
        <Body style={{ flex: 1 }}>If you or someone else is in immediate danger, call 000.</Body>
      </View>
    </Screen>
  );
}
