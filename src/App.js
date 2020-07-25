import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useReducer,
  useMemo,
} from 'react';
import {
  Platform,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';
import Swiper from 'react-native-swiper';
import BottomTabNavigator from './navigators/BottomTabNavigator';
import EventStackNavigator from './navigators/BottomTabNavigator';
import {
  AppearanceProvider,
  useColorScheme,
} from 'react-native-appearance';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider as EventProvider } from './context/EventContext';

import Colors from './constants/colors';
import AsyncStorage from '@react-native-community/async-storage';
import GettingStartedScreen from './screens/settingsScreens/GettingStartedScreen';
import { WelcomeContext } from './context/WelcomeContext';

const Stack = createStackNavigator();
const StartupStack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {
  const [isLoadingComplete] = useState(true);
  const [firstTime, setFirstTime] = useState(null);

  const welcomeContext = React.useMemo(() => {
    return {
      getWelcomeState: () => {
        var result = AsyncStorage.getItem('firstTime');
        if (result) {
          setFirstTime(false);
        } else {
          setFirstTime(true);
        }
      },
      setWelcomeState: () => {
        setFirstTime(false);
        AsyncStorage.setItem(
          'firstTime',
          JSON.stringify({ value: false }),
        );
      },
    };
  }, []);
  useEffect(() => {
    async function setup() {
      var result = await AsyncStorage.getItem('firstTime');
      if (result) {
        setFirstTime(false);
      } else {
        setFirstTime(true);
      }
    }
    setup();
    SplashScreen.hide();
  }, []);

  const scheme = useColorScheme();

  const DarkTheme = {
    dark: true,
    colors: {
      primary: '#202020',
      background: 'black',
      card: '#505050',
      text: '#fff',
      border: 'rgb(199, 199, 204)',
      icon: '#fff',
    },
  };
  const LightTheme = {
    dark: false,
    colors: {
      primary: '#fff',
      background: '#DEE4E7',
      card: '#faf0e6',
      text: 'black',
      border: 'rgb(199, 199, 204)',
      icon: 'black',
    },
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <StatusBar
          translucent={false}
          barStyle={
            scheme === 'dark' ? 'light-content' : 'dark-content'
          }
          backgroundColor={
            scheme === 'dark'
              ? DarkTheme.colors.background
              : LightTheme.colors.background
          }
        />

        <AppearanceProvider>
          <ApplicationProvider
            {...eva}
            theme={scheme === 'dark' ? eva.dark : eva.light}
          >
            <WelcomeContext.Provider value={welcomeContext}>
              <EventProvider>
                <MenuProvider>
                  <NavigationContainer
                    theme={scheme === 'dark' ? DarkTheme : LightTheme}
                  >
                    {firstTime && (
                      <StartupStack.Navigator>
                        <StartupStack.Screen
                          name="Welcome"
                          component={GettingStartedScreen}
                          options={
                            GettingStartedScreen.navigationOptions
                          }
                          initialParams={{
                            title: 'GettingStartedScreen',
                          }}
                        />
                      </StartupStack.Navigator>
                    )}
                    {!firstTime && (
                      <Stack.Navigator
                        screenOptions={{ headerShown: false }}
                      >
                        <Stack.Screen
                          name="Root"
                          component={BottomTabNavigator}
                          options={
                            BottomTabNavigator.navigationOptions
                          }
                        />
                        <Stack.Screen
                          name="Events"
                          component={EventStackNavigator}
                          options={
                            EventStackNavigator.navigationOptions
                          }
                        />
                      </Stack.Navigator>
                    )}
                  </NavigationContainer>
                </MenuProvider>
              </EventProvider>
            </WelcomeContext.Provider>
          </ApplicationProvider>
        </AppearanceProvider>

        <FlashMessage
          position="top"
          style={styles.falshContainer}
          titleStyle={styles.flashTitle}
          floating={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  falshContainer: {
    borderRadius: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  flashTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  Image1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  final: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  done: { padding: 5, borderRadius: 10, marginVertical: 5 },
});
