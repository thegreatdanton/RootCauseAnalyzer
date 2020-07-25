import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import EventStackNavigator from './EventStackNavigator';
import SettingsNavigator from './SettingsNavigator';

import CustomTabBar from './CustomTabBar';
import TestScreen from '../screens/TestScreen';

const BottomTab = createBottomTabNavigator();

const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
  });

  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBar={(BottomTabBarProps) => (
        <CustomTabBar {...BottomTabBarProps} />
      )}
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerStatusBarHeight: 20,
        headerTintColor: '#fff',
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="Events"
        component={EventStackNavigator}
        options={[
          EventStackNavigator.options,
          { title: 'Events', tabBarLabel: 'Events' },
        ]}
      />
      {/* <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: 'false',
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      /> */}
      {/* <BottomTab.Screen name="Test" component={TestScreen} /> */}
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={SettingsNavigator.options}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ??
    INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Settings':
      return 'Settings';

    default:
      break;
  }
}
