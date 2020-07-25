/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import TabBarIcon from './TabBarIcon';
import { useTheme } from '@react-navigation/native';

const menuIcon = {
  book: require('../../assets/images/document.png'),
  gear: require('../../assets/images/gear.png'),
};

const BottomMenuItem = ({ name, isCurrent }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {name === 'Events' && (
        <View style={styles.menu}>
          <Image source={menuIcon.book} style={styles.image} />
          <Text style={[styles.title, { color: colors.text }]}>
            {name}
          </Text>
        </View>
      )}
      {name === 'Test' && (
        <View style={styles.menu}>
          <Image source={menuIcon.gear} style={styles.image} />
          <Text style={[styles.title, { color: colors.text }]}>
            {name}
          </Text>
        </View>
      )}
      {name === 'Settings' && (
        <View style={styles.menu}>
          <Image source={menuIcon.gear} style={styles.image} />
          <Text style={[styles.title, { color: colors.text }]}>
            {name}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize:14,
    fontFamily:"SFUIText-Medium"
  },
  menu: {
    alignItems: 'center',
  },
  image: {
    height: 30,
    width: 30,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
export default BottomMenuItem;
