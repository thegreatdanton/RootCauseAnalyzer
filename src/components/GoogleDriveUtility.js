import React, { useState, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Easing,
  unstable_enableLogBox,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { Image } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
//import Spinner from 'react-native-loading-spinner-overlay';
import { Context as UserContext } from '../context/UserContext';
import { useTheme } from '@react-navigation/native';
import { Modal } from '@ui-kitten/components';
import { BarIndicator } from 'react-native-indicators';

import RNFS from 'react-native-fs';

console.disableYellowBox = true;

const url = 'https://www.googleapis.com/drive/v3';
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
const downloadHeaderPath =
  RNFS.DocumentDirectoryPath + '/eventData.json';
const boundaryString = 'chre';

const GoogleDriveUtility = () => {
  const { colors } = useTheme();
  const { saveUser, removeUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [isSignOutInProgress, setIsSignOutInProgress] = useState(
    false,
  );
  const [signedIn, setSignedIn] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function getUserInformation() {
        var result = await AsyncStorage.getItem('user');
        let userValue = JSON.parse(result);
        if (userValue === null) {
          setUserInfo(null);
          setSignedIn(false);
        } else {
          setUserInfo(userValue);
          setSignedIn(true);
        }
      }
      getUserInformation();
      console.log('configuring Google SignIn');
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.appdata'],
        // webClientId:
        //   '157564105254-52plmlosdj3m08u7pafr04h94dagq7mc.apps.googleusercontent.com',
        offlineAccess: false,
        // forceCodeForRefreshToken: true,
        // accountName: 'Chetan Reddy Piduru',
      });
    }, []),
  );

  const createMultiPartBody = (body, isUpdate = false) => {
    // https://developers.google.com/drive/v3/web/multipart-upload defines the structure
    const metaData = {
      name: 'eventData.json',
      description: 'Backup data for Root Cause App',
      mimeType: 'application/json',
    };
    // if it already exists, specifying parents again throws an error
    if (!isUpdate) {
      metaData.parents = ['appDataFolder'];
    }

    //request body
    const mulitpartBody =
      `\r\n--${boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metaData)}\r\n` +
      `--${boundaryString}\r\nContent-Type: application/json\r\n\r\n` +
      `${JSON.stringify(body)}\r\n` +
      `--${boundaryString}--`;

    return mulitpartBody;
  };

  const configurePostOptions = (bodyLength, isUpdate = false) => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${userInfo.googleToken}`);
    headers.append(
      'Content-Type',
      `multipart/related; boundary=${boundaryString}`,
    );
    headers.append('Content-Length', bodyLength);
    console.log(headers);
    return {
      method: isUpdate ? 'PATCH' : 'POST',
      headers,
    };
  };

  const signOut = async () => {
    try {
      setSignedIn(false);
      setUserInfo(null);
      setIsSignOutInProgress(true);
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      removeUser();
      setIsSignOutInProgress(false);
      showMessage({ message: 'Sign out Succesful', type: 'success' });
    } catch (error) {
      console.error(error);
    }
  };
  const signIn = async () => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const userValue = userData.user;
      setUserInfo({
        userName: userValue.name,
        userPhoto: userValue.photo,
        googleToken: tokens.accessToken,
      });
      saveUser({
        userName: userValue.name,
        userPhoto: userValue.photo,
        googleToken: tokens.accessToken,
      });
      setSignedIn(true);
      setIsSigninInProgress(false);
      showMessage({ message: 'Sign in Succesful', type: 'success' });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(error);
        setIsSigninInProgress(true);
      } else if (
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        // play services not available or outdated
        console.log(error);
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

  const uploadDateToGDrive = async () => {
    setUploading(true);
    var events = createFile();
    fileUpload(events);
  };

  const restoreFromGDrive = async () => {
    setRestoring(true);
    if (userInfo.googleToken) {
      checkFile();
    }
  };

  const createFile = async () => {
    try {
      var events = [];
      const keys = await AsyncStorage.getAllKeys();

      var filteredKeys = keys
        .filter((key) => key !== 'user')
        .filter((key) => key !== 'notifications')
        .filter((key) => key !== 'firstTime');
      var results = await AsyncStorage.multiGet(filteredKeys);

      results.map((result, i, event) => {
        let value = event[i][1];
        events.push(JSON.parse(value));
      });
      console.log(events);
      return events;
    } catch (error) {
      console.error('createFile', error);
    }
  };

  const fileUpload = (events) => {
    getFile()
      .then((file) => {
        if (file) {
          uploadFile(JSON.stringify(events), file.id);
        } else {
          uploadFile(JSON.stringify(events));
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
    setUploading(false);
    showMessage({ message: 'Backup Succesful', type: 'success' });
  };
  const checkFile = () => {
    getFile()
      .then((file) => {
        if (file) {
          downloadAndReadFile(file);
        } else {
          console.log('file no found');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  // download and read file to get data content in downloaded file
  const downloadAndReadFile = (file) => {
    const fromUrl = downloadFile(file.id);
    let downloadFileOptions = {
      fromUrl: fromUrl,
      toFile: downloadHeaderPath,
    };
    downloadFileOptions.headers = Object.assign(
      {
        Authorization: `Bearer ${userInfo.googleToken}`,
      },
      downloadFileOptions.headers,
    );

    console.log('downloadFileOptions', downloadFileOptions);

    RNFS.downloadFile(downloadFileOptions)
      .promise.then((res) => {
        console.log(res);
        return RNFS.readFile(downloadHeaderPath, 'utf8');
      })
      .then((content) => {
        console.log('content', content);
        var parsedResult = JSON.parse(content);
        var final = JSON.parse(parsedResult);
        var events = Object.values(final)[2];
        console.log(typeof events);
        events.forEach((element) => {
          const {
            id,
            eventTitle,
            eventDescription,
            date,
            category,
            color,
            starred,
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
              starred,
              reasons,
            }),
          );
        });
        setRestoring(false);
        showMessage({
          message: 'Restore Successful',
          type: 'success',
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  /**
   * create download url based on id
   */
  function downloadFile(existingFileId) {
    console.log(existingFileId);
    if (!existingFileId) {
      throw new Error("Didn't provide a valid file id.");
    }
    return `${url}/files/${existingFileId}?alt=media`;
  }

  const getFile = () => {
    const params = encodeURIComponent("name = 'eventData.json'");
    const options = configureGetOptions();
    return fetch(
      `${url}/files?q=${params}&spaces=appDataFolder`,
      options,
    )
      .then(parseHandleErrors)
      .then((body) => {
        console.log(body);
        if (body && body.files && body.files.length > 0) {
          return body.files[0];
        }
        return null;
      });
  };

  const uploadFile = (content, existingFileId) => {
    const body = createMultiPartBody(content, !!existingFileId);
    const options = configurePostOptions(
      body.length,
      !!existingFileId,
    );
    return fetch(
      `${uploadUrl}/files${
        existingFileId ? `/${existingFileId}` : ''
      }?uploadType=multipart`,
      { ...options, body },
    ).then(parseHandleErrors);
  };

  const parseHandleErrors = (response) => {
    console.log(response.ok);
    if (response.ok) {
      return response.json();
    }
    return response.json().then((error) => {
      throw new Error(JSON.stringify(error));
    });
  };

  const configureGetOptions = () => {
    const headers = new Headers();
    console.log('inside get', userInfo.googleToken);
    headers.append('Authorization', `Bearer ${userInfo.googleToken}`);
    return {
      method: 'GET',
      headers,
    };
  };

  return (
    <View style={{ backgroundColor: colors.background }}>
      {!signedIn && (
        <GoogleSigninButton
          style={styles.button}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          disabled={isSigninInProgress}
        />
      )}
      {signedIn && userInfo && (
        <View style={styles.gdriveContainer}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={{ uri: userInfo.userPhoto }}
              style={{ width: 50, height: 50 }}
            />
            <Text
              style={[
                styles.text,
                {
                  alignSelf: 'center',
                  fontSize: 20,
                  color: colors.text,
                },
              ]}
            >
              {userInfo.userName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <TouchableOpacity
              onPress={() => uploadDateToGDrive()}
              style={[
                styles.uploadToGoogle,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.text, { color: colors.text }]}>
                Cloud Backup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => restoreFromGDrive()}
              style={[
                styles.uploadToGoogle,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.text, { color: colors.text }]}>
                Cloud Restore
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => signOut()}
            style={[
              styles.uploadToGoogle,
              { backgroundColor: colors.primary },
            ]}
          >
            {/* <Icon name="log-out-outline" type="ionicon" /> */}
            <Text style={[styles.text, { color: colors.text }]}>
              Logout
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => checkAccessToken()}
            style={styles.uploadToGoogle}
          >
            <Icon name="log-out-outline" type="ionicon" />
            <Text>Check Token</Text>
          </TouchableOpacity> */}
        </View>
      )}
      {/* <Spinner
        visible={isSigninInProgress}
        textContent={'Sign in progress...'}
        textStyle={{ color: '#fff' }}
      />
      <Spinner
        visible={isSignOutInProgress}
        textContent={'Signing out...'}
        textStyle={{ color: '#fff' }}
      />
      <Spinner
        visible={uploading}
        textContent={'Uploading backup data...'}
        textStyle={{ color: '#fff' }}
      />
      <Spinner
        visible={restoring}
        textContent={'Restoring backup data...'}
        textStyle={{ color: '#fff' }}
      /> */}
      {/* <ActivityIndicator
        size="large"
        color="#0000ff"
        animating={restoring}
      /> */}

      <Modal
        backdropStyle={styles.backdrop}
        visible={
          restoring ||
          uploading ||
          isSigninInProgress ||
          isSignOutInProgress
        }
      >
        <View style={styles.content}>
          {restoring ? (
            <Text style={styles.modal}>Restoring Data !!!</Text>
          ) : null}
          {isSigninInProgress ? (
            <Text style={styles.modal}>Sigining in !!!</Text>
          ) : null}
          {uploading ? (
            <Text style={styles.modal}>Uploading Backup !!!</Text>
          ) : null}
          {isSignOutInProgress ? (
            <Text style={styles.modal}>Signining out !!!</Text>
          ) : null}
        </View>
      </Modal>
      <BarIndicator
        color="#fff"
        animating={
          restoring ||
          uploading ||
          isSigninInProgress ||
          isSignOutInProgress
        }
        animationEasing={Easing.linear}
        size={60}
        count={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  button: {
    height: 48,
    alignSelf: 'center',
    borderRadius: 10,
  },
  uploadToGoogle: {
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
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
  gdriveContainer: {
    backgroundColor: 'transparent',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginVertical: 50,
  },
  modal: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 30,
    fontSize: 20,
  },
});

export default GoogleDriveUtility;
