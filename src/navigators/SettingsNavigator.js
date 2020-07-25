import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import SettingsScreen from '../screens/SettingsScreen';
import BackupScreen from '../screens/BackupScreen';
import AboutScreen from '../screens/settingsScreens/AboutScreen';
import NewScreen from '../screens/settingsScreens/NewScreen';
import NotificationScreen from '../screens/settingsScreens/NotificationScreen';
import AppUsageScreen from '../screens/settingsScreens/AppUsageScreen';
import { Provider as UserProvider } from '../context/UserContext';
import { useTheme } from '@react-navigation/native';

const SettingsStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Settings';

export default function SettingsNavigator({ navigation, route }) {
  const { colors } = useTheme();
  return (
    <UserProvider>
      <SettingsStack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
        <SettingsStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <SettingsStack.Screen
          name="Backup"
          component={BackupScreen}
          options={BackupScreen.navigationOptions}
        />

        <SettingsStack.Screen
          name="About"
          component={AboutScreen}
          options={AboutScreen.navigationOptions}
        />
        <SettingsStack.Screen
          name="new"
          component={NewScreen}
          options={NewScreen.navigationOptions}
        />
        <SettingsStack.Screen
          name="Notifications"
          component={NotificationScreen}
          options={NotificationScreen.navigationOptions}
        />
        <SettingsStack.Screen
          name="AppUsage"
          component={AppUsageScreen}
          options={AppUsageScreen.navigationOptions}
        />
      </SettingsStack.Navigator>
    </UserProvider>
  );
}
