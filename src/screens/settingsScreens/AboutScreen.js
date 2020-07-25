import React from 'react';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const APPVERSION = '1.0(3)';
const PLAYSTORELINK = 'https://www.google.com';
const DEVPAGE = 'https://thegreatdanton93.wixsite.com/mysite';
const AboutScreen = ({ route, navigation }) => {
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
    <ScrollView style={styles.container}>
      <View style={styles.subCotainer}>
        <Image
          source={require('../../../assets/images/Icon500.png')}
          style={styles.welcomeImage}
        />
        <Text style={[styles.appTitle, { color: colors.text }]}>
          Root Cause
        </Text>
      </View>
      <View style={styles.subCotainer}>
        <Text style={[styles.normalText, { color: colors.text }]}>
          Version: {APPVERSION}
        </Text>
        <Text
          onPress={() =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.rootcause',
            )
          }
          style={[styles.normalText, { color: colors.text }]}
        >
          Root Cause on Google Play Store
        </Text>
      </View>
      <View style={styles.subCotainer}>
        <Text style={[styles.normalText, { color: colors.text }]}>
          Designed by
        </Text>
        <Text
          onPress={() =>
            Linking.openURL('https://www.dantonthegreat.com/')
          }
          style={[
            styles.devNameText,
            { color: colors.text, backgroundColor: colors.primary },
          ]}
        >
          Danton the Great
        </Text>
      </View>
      <View style={styles.subCotainer}>
        <Text style={[styles.appTitle, { color: colors.text }]}>
          Privacy Policy
        </Text>
        <Text style={[styles.normalText, { color: colors.text }]}>
          Root Cause doesn't collect or store any personally
          identifiable user information. App uses device camera to
          capture attachments. App uses Google's Firebase Crashlytics
          and Analytics to help resolve crashes and bugs. None of the
          personal information from the app is collected and stored by
          me.
        </Text>
        <Text
          onPress={() =>
            Linking.openURL(
              'https://thegreatdanton93.wixsite.com/mysite/privacy',
            )
          }
          style={[
            styles.normalText,
            { color: colors.text, backgroundColor: colors.primary },
          ]}
        >
          Read more from Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  subCotainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  normalText: {
    textAlign: 'center',
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
  },
  devNameText: {
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 25,
    marginHorizontal: 1,
    borderRadius: 5,
  },
  appTitle: {
    textAlign: 'center',
    fontFamily: 'SFUIText-Bold',
    fontSize: 30,
  },
  welcomeImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
});

export default AboutScreen;
