import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Layout';
import { colors, type } from '../theme';

// Beta change 1 (High, trust): "How your voice is used" is shown on the first Check in screen
// and on Privacy, because 2 of 5 testers could not find where audio deletion was explained.
const POINTS = [
  ['mic-outline', 'You speak, or type if you prefer.'],
  ['sparkles-outline', 'AI turns your note into text and suggests ratings. You can change them.'],
  ['trash-outline', 'The audio is deleted as soon as it has been turned into text.'],
  ['phone-portrait-outline', 'In this beta your notes stay on this phone.'],
];

export default function VoiceInfoCard() {
  return (
    <Card tone="soft">
      <Text accessibilityRole="header" style={[type.h3, { marginBottom: 8 }]}>How your voice is used</Text>
      {POINTS.map(([icon, text]) => (
        <View key={text} style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Ionicons name={icon} size={20} color={colors.primaryDark} style={{ marginRight: 10, marginTop: 2 }} />
          <Text style={[type.body, { flex: 1 }]}>{text}</Text>
        </View>
      ))}
    </Card>
  );
}
