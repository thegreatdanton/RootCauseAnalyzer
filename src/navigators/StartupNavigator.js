import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import GettingStartedScreen from '../screens/settingsScreens/GettingStartedScreen';
import { useTheme } from '@react-navigation/native';

const StartupStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'GettingStarted';

export default function StartupNavigator({ navigation, route }) {
  return (
    <StartupStack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <StartupStack.Screen
        name="GettingStarted"
        component={GettingStartedScreen}
        options={{ headerShown: false }}
        initialParams={{ title: 'GettingStarted' }}
      />
    </StartupStack.Navigator>
  );
}
