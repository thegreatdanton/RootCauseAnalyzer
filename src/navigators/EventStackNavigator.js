import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import HomeScreen from '../screens/HomeScreen';
import AddEventScreen from '../screens/AddEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import ReasonScreen from '../screens/ReasonScreen';
import { useTheme } from '@react-navigation/native';

const EventStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function EventStackNavigator({ navigation, route }) {
  const { colors } = useTheme();
  return (
    <EventStack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{ headerShown: true }}
    >
      <EventStack.Screen
        name="Home"
        component={HomeScreen}
        options={HomeScreen.navigationOptions}
      />
      <EventStack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={AddEventScreen.navigationOptions}
      />
      <EventStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={EventDetailScreen.navigationOptions}
      />
      <EventStack.Screen
        name="Reason"
        component={ReasonScreen}
        options={ReasonScreen.navigationOptions}
      />
    </EventStack.Navigator>
  );
}
