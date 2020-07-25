import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';

const AppUsageScreen = ({ route, navigation }) => {
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
    }),
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/underconstruction.png')}
        style={styles.welcomeImage}
      />
      <View style={styles.textcontainer}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Under Construction
        </Text>
        <Text style={[styles.text, { color: colors.text }]}>
          App usage guide is being worked upon and will be available
          in the next update
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 5,
  },
  welcomeImage: {
    marginHorizontal: 10,
    height: 300,
    width: 200,
  },
  heading: {
    fontSize: 25,
    fontFamily: 'SFUIText-Bold',
    textAlign: 'center',
  },

  text: {
    fontSize: 20,
    fontFamily: 'SFUIText-Regular',
    textAlign: 'center',
  },
  textcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default AppUsageScreen;
