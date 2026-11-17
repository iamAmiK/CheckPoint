import React from 'react';
import { Text } from 'react-native';
import { Screen, Card, Body } from '../components/Layout';
import Button from '../components/Button';
import VoiceInfoCard from '../components/VoiceInfoCard';
import { useApp } from '../store/AppContext';
import { exportData } from '../utils/exportData';
import { type } from '../theme';

// Privacy: the "How your voice is used" card (beta change 1) plus Export and Delete shown here too (beta change 2).
export default function PrivacyScreen({ navigation }) {
  const { state } = useApp();
  return (
    <Screen>
      <VoiceInfoCard />
      <Card>
        <Text style={type.h3} accessibilityRole="header">Your data</Text>
        <Body style={{ marginVertical: 8 }}>
          Your notes are private and stay on this phone. You can take a copy or remove everything at any time.
        </Body>
        <Button title="Export my data" variant="secondary" icon="download-outline" onPress={() => exportData(state)} />
        <Button title="Delete my data" variant="ghost" icon="trash-outline" onPress={() => navigation.navigate('DeleteData')} style={{ marginTop: 8 }} />
      </Card>
    </Screen>
  );
}
