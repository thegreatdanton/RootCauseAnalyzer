import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../constants/colors';

export default function TabBarIcon(props) {
  return (
    <Icon
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.secondary : Colors.tabIconDefault}
    />
  );
}
