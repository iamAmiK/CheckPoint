import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider, useApp } from './src/store/AppContext';
import NeedHelpLink from './src/components/NeedHelpLink';
import { colors } from './src/theme';

import SetupScreen from './src/screens/SetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import RhythmScreen from './src/screens/RhythmScreen';
import MoreScreen from './src/screens/MoreScreen';
import RecordScreen from './src/screens/RecordScreen';
import TypeNoteScreen from './src/screens/TypeNoteScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import SavedScreen from './src/screens/SavedScreen';
import SleepInsightsScreen from './src/screens/SleepInsightsScreen';
import SupportScreen from './src/screens/SupportScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import DeleteDataScreen from './src/screens/DeleteDataScreen';
import HealthScreen from './src/screens/HealthScreen';
import SmallActionScreen from './src/screens/SmallActionScreen';
import AccountScreen from './src/screens/AccountScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary } };

// Five tabs (within Miller's 7 +/- 2) with the core task, Check in, in the centre.
// "Need help?" is the headerRight of every tab, so it is always in the same place.
const TABS = [
  { name: 'Home', title: 'Home', component: HomeScreen, icon: 'home' },
  { name: 'Insights', title: 'Insights', component: InsightsScreen, icon: 'stats-chart' },
  { name: 'CheckIn', title: 'Check in', component: CheckInScreen, icon: 'add-circle' },
  { name: 'Rhythm', title: 'Rhythm', component: RhythmScreen, icon: 'calendar' },
  { name: 'More', title: 'More', component: MoreScreen, icon: 'ellipsis-horizontal-circle' },
];

function Tabs() {
  const { justOnboarded } = useApp();
  return (
    <Tab.Navigator
      // After setup, land on Check in so the first note is ready to record
      initialRouteName={justOnboarded.current ? 'CheckIn' : 'Home'}
      screenOptions={{
        headerRight: () => <NeedHelpLink />,
        headerRightContainerStyle: { paddingRight: 8 },
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      {TABS.map((t) => (
        <Tab.Screen
          key={t.name}
          name={t.name}
          component={t.component}
          options={{
            title: t.title,
            tabBarAccessibilityLabel: `${t.title} tab`,
            tabBarIcon: ({ color, size }) => <Ionicons name={t.icon} size={t.name === 'CheckIn' ? size + 6 : size} color={color} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

// Spoke and detail screens sit above the tabs, so the Check in flow has no tab bar.
const stackOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
  headerTintColor: colors.primaryDark,
  headerTitleStyle: { fontWeight: '700', color: colors.text },
  contentStyle: { backgroundColor: colors.bg },
};

function MainNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={stackOptions}>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Record" component={RecordScreen} options={{ title: 'Voice note', headerBackTitle: 'Back' }} />
        <Stack.Screen name="TypeNote" component={TypeNoteScreen} options={{ title: 'Type a note' }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review check in' }} />
        <Stack.Screen name="Saved" component={SavedScreen} options={{ title: 'Saved', headerBackVisible: false, gestureEnabled: false }} />
        <Stack.Screen name="SleepInsights" component={SleepInsightsScreen} options={{ title: 'Sleep and mood' }} />
        <Stack.Screen name="SmallAction" component={SmallActionScreen} options={{ title: 'Small action' }} />
        <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy' }} />
        <Stack.Screen name="DeleteData" component={DeleteDataScreen} options={{ title: 'Delete my data' }} />
        <Stack.Screen name="HealthConnections" component={HealthScreen} options={{ title: 'Health connections' }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Setup sits outside the tabs: a short linear flow that is completed or skipped once.
function Root() {
  const { state } = useApp();
  if (!state.loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return state.settings.onboarded ? <MainNavigator /> : <SetupScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
