import React, { useReducer, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WelcomeContext } from '../../context/WelcomeContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const GettingStartedScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { title } = route.params;
  const { setWelcomeState } = useContext(WelcomeContext);
  var headerName = title;

  console.log(navigation.dangerouslyGetState().routes);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerShown: false,
        // title: headerName,
        // headerStyle: { backgroundColor: colors.background },
        // headerTintColor: colors.text,
        // headerTitleStyle: {
        //   fontFamily: 'SFUIText-Bold',
        //   color: colors.text,
        // },
      });
    }),
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <Swiper
        style={styles.container}
        showsButtons={true}
        loop={false}
        dotColor={colors.border}
      >
        <Image
          source={require('../../../assets/images/Image1.png')}
          style={styles.Image1}
        />
        <Image
          source={require('../../../assets/images/Image2.png')}
          style={styles.Image1}
        />
        <Image
          source={require('../../../assets/images/Image3.png')}
          style={styles.Image1}
        />
        <Image
          source={require('../../../assets/images/Image4.png')}
          style={styles.Image1}
        />
        <Image
          source={require('../../../assets/images/Image5.png')}
          style={styles.Image1}
        />
        <Image
          source={require('../../../assets/images/Image6.png')}
          style={styles.Image1}
        />
        <View style={styles.final}>
          <Text style={[styles.text, { color: colors.text }]}>
            For more help and using app, please checkout :
          </Text>
          <Text style={[styles.boldText, { color: colors.text }]}>
            Settings -> Help
          </Text>
          <TouchableOpacity
            onPress={async () => {
              setWelcomeState();
            }}
            style={[styles.done, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.boldText, { color: colors.text }]}>
              Done
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
        onPress={() =>
          navigation.navigate('AppUsage', { title: 'Help' })
        }
        style={[styles.done, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.text}>check out usage guide</Text>
      </TouchableOpacity> */}
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  wrapper: {},
  Image1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  Image2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  Image3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  Image4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  Image5: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  Image6: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  text: {
    fontSize: 20,
    fontFamily: 'SFUIText-Regular',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  boldText: {
    fontSize: 20,
    fontFamily: 'SFUIText-Bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  final: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  done: {
    padding: 5,
    borderRadius: 10,
    marginVertical: 20,
  },
});

export default GettingStartedScreen;
