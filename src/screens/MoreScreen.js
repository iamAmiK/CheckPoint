import React from 'react';
import { Text } from 'react-native';
import { Screen, Card, ListRow, Caption } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { exportData } from '../utils/exportData';
import { colors, type } from '../theme';

// More is a hierarchy: grouped lists, never deeper than one more level.
// Beta change 2: the group is now called "Your data" and Export / Delete sit directly in it,
// because one tester looked under Account for Delete data in both test rounds.
const Group = ({ title, children }) => (
  <>
    <Text accessibilityRole="header" style={[type.caption, { marginBottom: 6, marginLeft: 4, fontWeight: '600' }]}>{title}</Text>
    <Card style={{ paddingVertical: 0 }}>{children}</Card>
  </>
);

export default function MoreScreen({ navigation }) {
  const { state, dispatch } = useApp();
  return (
    <Screen>
      <Group title="Help">
        <ListRow icon="heart-outline" title="Support" subtitle="Talk to someone" onPress={() => navigation.navigate('Support')} last />
      </Group>

      <Group title="Your data">
        <ListRow icon="shield-checkmark-outline" title="Privacy" subtitle="How your voice and notes are used" onPress={() => navigation.navigate('Privacy')} />
        <ListRow icon="download-outline" title="Export my data" subtitle="Get a copy of your notes and ratings" onPress={() => exportData(state)} />
        <ListRow icon="trash-outline" title="Delete my data" subtitle="Remove everything from this phone" onPress={() => navigation.navigate('DeleteData')} last />
      </Group>

      <Group title="Settings">
        <ListRow icon="person-outline" title="Account" onPress={() => navigation.navigate('Account')} />
        <ListRow icon="notifications-outline" title="Notifications" onPress={() => navigation.navigate('Notifications')} />
        <ListRow icon="fitness-outline" title="Health connections" subtitle="Sleep and activity" onPress={() => navigation.navigate('HealthConnections')} last />
      </Group>

      <Group title="Beta tools">
        <ListRow icon="albums-outline" title="Load demo data" subtitle="Adds 30 days of sample Check ins to explore Insights" onPress={() => dispatch({ type: 'LOAD_DEMO' })} />
        <ListRow icon="refresh-outline" title="Restart setup" subtitle="Shows the welcome screens again" onPress={() => dispatch({ type: 'SET_SETTINGS', payload: { onboarded: false } })} last />
      </Group>
      <Caption style={{ textAlign: 'center' }}>CheckPoint beta 1.0</Caption>
    </Screen>
  );
}
