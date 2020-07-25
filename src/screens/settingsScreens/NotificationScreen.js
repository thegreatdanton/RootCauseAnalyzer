import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { timeFormat } from '../../helpers/DateFormatter';
import Colors from '../../constants/colors';
import { CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import { color } from 'react-native-reanimated';

const NotificationScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { title } = route.params;
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(false);

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

      async function setUp() {
        var result = await AsyncStorage.getItem('notifications');
        var notifications = JSON.parse(result);
        console.log(notifications);
        if (notifications) {
          setChecked(true);
          if (notifications.day) {
            setDaily(true);
            setWeekly(false);
          } else {
            setDaily(false);
            setWeekly(true);
          }
          setTime(new Date(notifications.time));
        }
      }
      setUp();

      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);

          // process the notification

          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION:', notification);

          // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
          console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
      });
    }, []),
  );

  useEffect(() => {
    if (checked) {
      if (daily) {
        PushNotification.cancelAllLocalNotifications();
        PushNotification.localNotificationSchedule({
          date: new Date(time.getTime() + 86400000),
          title: 'Local Notification',
          message: 'My Notification Message',
          repeatType: 'day',
        });
        showMessage({
          message: 'Subscribed to daily notifications',
          type: 'success',
        });
        AsyncStorage.removeItem('notifications');
        AsyncStorage.setItem(
          'notifications',
          JSON.stringify({ day: true, time: time }),
        );
      } else {
        PushNotification.cancelAllLocalNotifications();
        PushNotification.localNotificationSchedule({
          date: new Date(time.getTime() + 86400000),
          title: 'Local Notification',
          message: 'My Notification Message',
          repeatType: 'week',
        });
        showMessage({
          message: 'Subscribed to weekly notifications',
          type: 'success',
        });
        AsyncStorage.removeItem('notifications');
        AsyncStorage.setItem(
          'notifications',
          JSON.stringify({ day: false, time: time }),
        );
      }
    } else {
      PushNotification.cancelAllLocalNotifications();
      showMessage({
        message: 'Unsubscribed from notifications',
        type: 'success',
      });
      AsyncStorage.removeItem('notifications');
    }
  }, [checked, daily, time]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || time;
    setShow(Platform.OS === 'ios');
    setTime(currentDate);
    setShow(false);
  };

  var formattedTime = timeFormat(time);
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.subscribeContainer,
          { backgroundColor: colors.primary },
        ]}
      >
        {!checked && (
          <Text style={[styles.checkboxtext, { color: colors.text }]}>
            Subscrible to notifications
          </Text>
        )}
        {checked && (
          <Text style={[styles.checkboxtext, { color: colors.text }]}>
            Unsubscribe from notification
          </Text>
        )}
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={checked ? Colors.secondary : Colors.grey}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            setChecked(!checked);
          }}
          value={checked}
        />
      </View>
      {checked && (
        <View style={{ padding: 10 }}>
          <Text
            style={[
              styles.checkboxtext,
              { color: colors.text, fontFamily: 'SFUIText-Bold' },
            ]}
          >
            Schedule
          </Text>
        </View>
      )}

      {checked && (
        <View>
          <TouchableOpacity
            style={[styles.schedule, { borderColor: colors.card }]}
            onPress={showTimepicker}
          >
            <Text style={[styles.text, { color: colors.text }]}>
              Set Time
            </Text>
            <Text style={[styles.text, { color: colors.text }]}>
              {formattedTime}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(time)}
              mode={mode}
              display="spinner"
              onChange={onChange}
            />
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
            }}
          >
            <CheckBox
              title="Daily"
              checked={daily}
              onPress={() => {
                if (!daily) {
                  setDaily(!daily);
                  setWeekly(!weekly);
                }
                //updateNotificationSettings();
              }}
              containerStyle={[
                styles.checkboxContainer,
                { backgroundColor: colors.primary },
              ]}
              textStyle={[
                styles.checkboxtext,
                { color: colors.text },
              ]}
            />
            <CheckBox
              title="Weekly"
              checked={weekly}
              onPress={() => {
                if (!weekly) {
                  setWeekly(!weekly);
                  setDaily(!daily);
                }
                //  updateNotificationSettings();
              }}
              containerStyle={[
                styles.checkboxContainer,
                { backgroundColor: colors.primary },
              ]}
              textStyle={[
                styles.checkboxtext,
                { color: colors.text },
              ]}
            />
          </View>
        </View>
      )}
      <View style={styles.noteContainer}>
        <Text style={[styles.noteTextHeader, {color: colors.text}]}>What Notifications ?</Text>
        <Text style={[styles.noteText,{color: colors.text}]}>Notifications to remind users to update events & reasons</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  text: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
    padding: 5,
  },
  checkboxContainer: {
    borderColor: 'transparent',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    height: 50,
    width: 170,
  },
  scheduleContainer: {
    borderColor: 'transparent',
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  checkboxtext: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
  },
  subscribeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 15,
  },
  timepicker: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,

    padding: 5,
    marginLeft: 10,
  },
  schedule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    alignSelf: 'center',
  },
  noteText:{
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
    textAlign:"center"
  },
  noteTextHeader:{
    fontFamily:" SFUIText-Bold",
    fontSize:20,
    textAlign:"center"
  },
  noteContainer:{
    justifyContent:"center",
    alignItems:"center",
    margin:10,
  }
});

export default NotificationScreen;
