import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { Divider } from 'react-native-elements';

const newFeatures = [
  '1. Color coded events,',
  '2. Swipe to delete events,',
  '3. Dark Theme support,',
  '4. Cloud Backup,',
  '6. Notifications,',
  '7. Timeline of reasons,',
  '8. Attachements for events,',
  'and many more',
];
const issues = ['N/A'];
const upcoming = ['1. Mark Event as done,', '2. Animations,', '3. Local Backup and Restore,', '4. Help guide'];
const NewScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { title } = route.params;
  var headerName = title;

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        title: headerName,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'SFUIText-Bold',
          color: colors.text,
        },
      });
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Initial Release
      </Text>
      <FlatList
        data={newFeatures}
        keyExtractor={({ item }) => item}
        renderItem={({ item }) => {
          return (
            <Text style={[styles.text, { color: colors.text }]}>
              {item}
            </Text>
          );
        }}
      />
      <Divider
        style={{ height: 2, color: colors.border, margin: 20 }}
      />
      <Text style={[styles.heading, { color: colors.text }]}>
        Known Issues
      </Text>
      <FlatList
        data={issues}
        keyExtractor={({ item }) => item}
        renderItem={({ item }) => {
          return (
            <Text style={[styles.text, { color: colors.text }]}>
              {item}
            </Text>
          );
        }}
      />
      <Divider
        style={{ height: 2, color: colors.border, margin: 20 }}
      />
      <Text style={[styles.heading, { color: colors.text }]}>
        Upcoming
      </Text>
      <FlatList
        data={upcoming}
        keyExtractor={({ item }) => item}
        renderItem={({ item }) => {
          return (
            <Text style={[styles.text, { color: colors.text }]}>
              {item}
            </Text>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 20,
    fontFamily: 'SFUIText-Regular',
    textAlign: 'center',
  },
  textcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 25,
    fontFamily: 'SFUIText-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default NewScreen;
