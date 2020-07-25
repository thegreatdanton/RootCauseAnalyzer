import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

const initialIcon = {
  events: require('../../assets/images/Icon500.png'),
};

const EmptyEvents = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Image source={initialIcon.events} style={styles.image} />
      <Text h2 style={[styles.text, { color: colors.text }]}>
        Add Events
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    borderRadius: 1,
  },
  image: {
    height: 300,
    marginHorizontal: 10,
    width: 300,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    fontStyle: 'italic',
  },
});

export default EmptyEvents;
