/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Text } from 'react-native-elements';
import SettingsSection from '../components/SettingsSection';
import { colors } from 'react-native-elements';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { useTheme } from '@react-navigation/native';

const settingsIcons = {
  backup: require('../../assets/images/Icon_cloud100.png'),
  importIcon: require('../../assets/images/Icon_Export96.png'),
  about: require('../../assets/images/Icon_About100.png'),
  help: require('../../assets/images/Icon_Help100.png'),
  new: require('../../assets/images/Icon_WhatsNew.png'),
  notification: require('../../assets/images/Icon_Notification100.png'),
};

const SettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [] = useState(new Animated.Value(0));

  const backupSettings = [
    {
      title: 'App Settings',
      data: [
        {
          name: 'Backup and Restore',
          icon: settingsIcons.backup,
          screen: 'Backup',
        },
        {
          name: 'Notifications',
          icon: settingsIcons.notification,
          screen: 'Notifications',
        },
      ],
    },
  ];
  // const notifications = [
  //   {
  //     title: 'Notifications',
  //     data: [
  //       {
  //         name: 'Notifications',
  //         icon: settingsIcons.notification,
  //         screen: 'Notifications',
  //       },
  //     ],
  //   },
  // ];
  const About = [
    {
      title: 'About',
      data: [
        {
          name: 'About & Privacy Policy',
          icon: settingsIcons.about,
          screen: 'About',
        },
      ],
    },
  ];
  const Help = [
    {
      title: 'Help & Usage',
      data: [
        // {
        //   name: 'Getting Started',
        //   icon: settingsIcons.help,
        //   screen: 'Help',
        // },
        {
          name: 'What is new',
          icon: settingsIcons.new,
          screen: 'new',
        },
        {
          name: 'Help',
          icon: settingsIcons.help,
          screen: 'AppUsage',
        },
      ],
    },
  ];

  const settings = [backupSettings, Help, About];
  const onScroll = () => {};
  return (
    <ParallaxScrollView
      onScroll={onScroll}
      backgroundSpeed={10}
      backgroundColor={colors.background}
      contentBackgroundColor={colors.background}
      parallaxHeaderHeight={250}
      stickyHeaderHeight={50}
      renderBackground={() => (
        <View
          style={[
            styles.welcomeContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Image
            source={require('../../assets/images/Icon500.png')}
            style={styles.welcomeImage}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 25,
              fontFamily: 'SFUIText-Bold',
            }}
          >
            Settings
          </Text>
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: 20,
              marginTop: 18,
            }}
          />
        </View>
      )}
      renderForeground={() => (
        <View
          style={{
            justifyContent: 'flex-end',
            height: '100%',
          }}
        >
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: 20,
              marginTop: 18,
              backgroundColor: colors.background,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 20,
                fontFamily: 'OpenSans-Italic',
              }}
            >
              Root Cause
            </Text>
          </View>
        </View>
      )}
      renderStickyHeader={() => (
        <SafeAreaView
          key="sticky-header"
          style={{
            backgroundColor: colors.background,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 5,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              marginHorizontal: 16,
              fontFamily: 'SFUIText-Bold',
            }}
          >
            Settings
          </Text>
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: 20,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 20,
                fontFamily: 'OpenSans-Italic',
              }}
            >
              Root Cause
            </Text>
          </View>
        </SafeAreaView>
      )}
    >
      <View
        style={[
          styles.settings,
          { backgroundColor: colors.background },
        ]}
      >
        <FlatList
          data={settings}
          style={{ height: null }}
          keyExtractor={(item, index) =>
            item.title + index.toString()
          }
          scrollEnabled
          renderItem={({ item }) => {
            return (
              <SettingsSection data={item} navigation={navigation} />
            );
          }}
        />
        {/* <SettingsSection data={backupSettings} />
        <SettingsSection data={notifications} />
        <SettingsSection data={WhatIsNew} />
        <SettingsSection data={About} />
        <SettingsSection data={Help} /> */}
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexDirection: 'column',
    flex: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  settings: {
    flex: 1,
    backgroundColor: colors.background,
  },
  avatar: {
    height: 50,
    width: 50,
  },
});

export default SettingsScreen;
