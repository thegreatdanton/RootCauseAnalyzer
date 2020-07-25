import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

const SettingsComponent = ({ name, iconUrl, detail, navigation }) => {
  const { colors } = useTheme();
  const screenName = detail;
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Image source={iconUrl} style={styles.welcomeImage} />
      </View>

      <View style={styles.textView}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate({
              name: screenName,
              params: { title: name },
            })
          }
        >
          <Text style={[styles.name, { color: colors.text }]}>
            {name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    color: 'white',
    fontSize: 18,
    //fontWeight: 'bold',
    fontFamily: 'SFUIText-Regular',
  },
  container: {
    marginLeft: 10,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingBottom: 5,
  },
  icon: {
    flex: 0.12,
    alignItems: 'center',
  },
  welcomeImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  textView: {
    flex: 0.9,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default SettingsComponent;
