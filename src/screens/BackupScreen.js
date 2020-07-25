import React from 'react';
import { View, StyleSheet, PermissionsAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GoogleDriveUtility from '../components/GoogleDriveUtility';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, Text } from 'react-native-elements';
import Colors from '../constants/colors';
import { useTheme } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage } from 'react-native-flash-message';
console.disableYellowBox = true;

const downloadHeaderPath =
  RNFS.DocumentDirectoryPath + '/eventData.json';

const BackupScreen = ({ route, navigation }) => {
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
      checkPermission();
    }, []),
  );

  const checkPermission = () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ).then((writeGranted) => {
      console.log('writeGranted', writeGranted);
      if (!writeGranted) {
        requestWriteStoragePermission();
      }
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then((readGranted) => {
        console.log('readGranted', readGranted);
        if (!readGranted) {
          requestReadStoragePermission();
        }
      });
    });
  };

  const createFile = async () => {
    try {
      var events = [];
      const keys = await AsyncStorage.getAllKeys();

      var filteredKeys = keys.filter((key) => key !== 'user');

      var results = await AsyncStorage.multiGet(filteredKeys);

      results.map((result, i, event) => {
        let value = event[i][1];
        events.push(JSON.parse(value));
      });
      return events;
    } catch (error) {
      console.error('createFile', error);
    }
  };

  /**
   * require write storage permission
   */
  async function requestWriteStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Write your android storage Permission',
          message: 'Write your android storage to save your data',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can write storage');
      } else {
        console.log('Write Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  /**
   * * require read storage permission
   */
  async function requestReadStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read your android storage Permission',
          message: 'Read your android storage to save your data',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can Read storage');
      } else {
        console.log('Read Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const saveToDeviceStorage = () => {
    var path = RNFS.DocumentDirectoryPath + '/eventData.json';
    var events = createFile();
    RNFS.writeFile(path, events, 'utf8')
      .then((success) => {
        console.log('Backup Success');
      })
      .catch((error) => console.log(error.message));
  };

  const readFromDeviceStorage = () => {
    var path = RNFS.DocumentDirectoryPath + '/eventData.json';

    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((result) => {
        console.log('GoT Result', result);
        return Promise.all([
          RNFS.stat(result[0].path),
          result[0].path,
        ]);
      })
      .then((statResult) => {
        if (statResult[0].isFile()) {
          return RNFS.readFile(statResult[1], 'utf8');
        }
        console.log('nofile');
        return 'no file';
      })
      .then((contents) => {
        console.log('file');
        console.log(contents);
        var parsedResult = JSON.parse(contents);
        var final = JSON.parse(parsedResult);
        console.log(final);
        console.log(typeof final);
        final.forEach((element) => {
          const {
            id,
            eventTitle,
            eventDescription,
            date,
            category,
            color,
            reasons,
          } = element;
          AsyncStorage.mergeItem(
            id.toString(),
            JSON.stringify({
              id,
              eventTitle,
              eventDescription,
              date,
              category,
              color,
              reasons,
            }),
          );
        });
        // setRestoring(false);
        showMessage({
          message: 'Restore Successful',
          type: 'success',
        });
      })
      .catch((err) => {
        showMessage({
          message: err.message,
          type: 'error',
        });
      });
  };

  const deleteBackup = () => {
    var path = RNFS.DocumentDirectoryPath + '/eventData.json';
    return RNFS.unlink(path)
      .then(() => {
        showMessage({
          message: 'Restore Successful',
          type: 'success',
        });
      })
      .catch((err) => {
        showMessage({
          message: err.message,
          type: 'error',
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>
        Cloud Backup
      </Text>
      <View style={styles.cloudBackup}>
        <GoogleDriveUtility />
      </View>
      <Divider style={styles.divider} />
      <Text
        style={[
          styles.text,
          { color: colors.text, fontFamily: 'SFUIText-Medium' },
        ]}
      >
        Local Backup
      </Text>
      <View style={{ backgroundColor: 'transparent' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <TouchableOpacity
            onPress={() => saveToDeviceStorage()}
            style={[
              styles.localButton,
              { backgroundColor: colors.primary },
            ]}
          >
            {/* <Icon
            name="file-export"
            type="font-awesome"
            color="#517fa4"
          /> */}
            <Text style={[styles.text, { color: colors.text }]}>
              Local Backup
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => readFromDeviceStorage()}
            style={[
              styles.localButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={[styles.text, { color: colors.text }]}>
              Local Restore
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => deleteBackup()}
          style={[
            styles.localButton,
            { backgroundColor: colors.primary },
          ]}
        >
          {/* <Icon name="log-out-outline" type="ionicon" /> */}
          <Text
            style={[
              styles.text,
              { color: colors.text, textAlign: 'center' },
            ]}
          >
            Delete Local Backup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 20 },
  cloudBackup: {
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: Colors.secondary,
    marginVertical: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localBackup: {
    marginVertical: 10,
    justifyContent: 'center',
  },
  localButton: {
    height: 50,
    backgroundColor: '#202020',
    alignContent: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  text: {
    marginHorizontal: 5,
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
  },
  divider: {
    backgroundColor: Colors.secondary,
    height: 1,
    marginHorizontal: 5,
    marginVertical: 5,
  },
});

export default BackupScreen;
