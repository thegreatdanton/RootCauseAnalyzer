import React, {
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  FlatList,
  PermissionsAndroid,
  Dimensions,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon, Image } from 'react-native-elements';
import { Context as EventContext } from '../context/EventContext';
import customStyles from '../constants/styles';
import { useTheme } from '@react-navigation/native';
import {
  dateFormat,
  timeFormat,
  datetimeFormat,
} from '../helpers/DateFormatter';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
import Colors from '../constants/colors';
import AlertPro from 'react-native-alert-pro';

const window = Dimensions.get('window');

const ReasonScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { state, addReason } = useContext(EventContext);
  const [important, setImportant] = useState(false);
  const [description, setdescription] = useState('');
  const [toggleInput, setToggleInput] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, settime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [attachmentList, setAttachmentList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [] = useState(0);
  const [image, setImage] = useState(null);
  const [deletedValue, setDeletedValue] = useState('');

  const { id, reason, addingReason } = route.params;
  const event = state.find((item) => item.id === id);
  const alertRef = useRef();
  const modalRef = useRef();

  var {
    eventTitle,
    eventDescription,
    date,
    category,
    color,
    reasons,
    starred,
    done,
  } = event;

  var formattedTime = datetimeFormat(newDate);

  const options = {
    title: 'Attach Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    permissionDenied: {
      tite: 'Camera permission denied',
      text: 'Root Cause has been denied permission to access camera',
      reTryTitle: 'Retry',
    },
  };
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Reason',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'SFUIText-Bold',
          color: colors.text,
        },
      });
      function setup() {
        setdescription(reason.description);
        setImportant(reason.important);
        settime(timeFormat(reason.reasonDate));
        setNewDate(reason.reasonDate);
        setTitle(dateFormat(reason.reasonDate));
        setAttachmentList(reason.attachmentList);
        if (addingReason) {
          setToggleInput(true);
        }
      }
      setup();
      console.log(important);
    }, []),
  );

  const saveReason = () => {
    console.log('save');
    addReason(
      id,
      eventTitle,
      eventDescription,
      date,
      category,
      color,
      reasons,
      starred,
      done,
      () =>
        navigation.navigate('EventDetail', {
          id,
          eventTitle,
          date,
          category,
          color,
          reasons,
          starred,
          done,
        }),
    );
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShow(false);
    } else {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setNewDate(currentDate);
      setNewDate(currentDate);
      setTitle(dateFormat(currentDate));
      settime(timeFormat(currentDate));
      setSaveToggle(true);
      if (mode === 'date') {
        setMode('time');
        setShow('time');
      }
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const attachImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response =', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log(response.error);
        if (response.error.includes('Permissions')) {
          console.log('permission');
          async function requestCameraPermission() {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Root Cause App Camera Permission',
                message:
                  'Root Cause needs to access to your camera to attach images',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You can use the camera');
            } else {
              console.log('Camera permission denied');
            }
          }
          if (Platform.OS === 'android') {
            requestCameraPermission();
          }
        }
      } else if (response.error) {
      } else if (response.customButton) {
        console.log(
          'User tapped custom button: ',
          response.customButton,
        );
      } else {
        const source = { uri: response.uri };
        setAttachmentList(attachmentList.concat(source));
        setSaveToggle(true);
      }
    });
  };

  const handleLongPress = (item) => {
    console.log(item);
  };

  const deleteReasonFromList = (value) => {
    var list = reasons.filter((item) => item.description !== value);
    reasons = list;
    addReason(
      id,
      eventTitle,
      eventDescription,
      date,
      category,
      color,
      reasons,
      starred,
      done,
      () =>
        navigation.navigate('EventDetail', {
          id,
          eventTitle,
          eventDescription,
          date,
          category,
          color,
          reasons,
          starred,
          done,
        }),
    );
  };
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View>
        <Text style={[styles.eventTitle, { color: colors.text }]}>
          {eventTitle}
        </Text>
      </View>
      <View style={styles.description}>
        {toggleInput && (
          <TextInput
            placeholder="Enter your reason"
            placeholderTextColor={colors.text}
            value={description}
            multiline={true}
            autoGrow={true}
            maxLength={300}
            autoFocus={toggleInput}
            onChangeText={(value) => {
              if (value.length !== 0) {
                setSaveToggle(true);
              } else {
                setSaveToggle(false);
              }
              setdescription(value);
            }}
            style={[
              styles.input,
              { backgroundColor: colors.primary, color: colors.text },
            ]}
          />
        )}
        {!toggleInput && (
          <TouchableOpacity
            onPress={() => {
              setToggleInput(true);
              setSaveToggle(true);
            }}
            activeOpacity={1}
            style={[
              styles.textContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={[styles.reasonText, { color: colors.text }]}>
              {description}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={[
            styles.timepicker,
            {
              borderColor: Colors.secondary,
            },
          ]}
          onPress={() => setShow(true)}
        >
          <Text style={[styles.time, { color: colors.text }]}>
            {formattedTime}
          </Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(newDate)}
          mode={mode}
          display="spinner"
          onChange={onChange}
        />
      )}
      <View style={styles.optioncontainer}>
        <TouchableOpacity
          onPress={() => attachImage()}
          style={styles.option}
        >
          <Icon
            name="paperclip"
            type="font-awesome"
            color="#10375C"
            size={18}
            reverse
            raised
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon
            name="star"
            type="font-awesome"
            color={
              important === true ? colors.border : Colors.secondary
            }
            onPress={() => {
              setImportant(!important);
              setSaveToggle(true);
            }}
            size={18}
            reverse
            raised
          />
        </TouchableOpacity>

        {!addingReason && (
          <TouchableOpacity
            onPress={() => {
              setDeletedValue(reason.description);
              alertRef.current.open();
            }}
            style={styles.option}
          >
            <Icon
              name="trash-o"
              type="font-awesome"
              color="#10375C"
              size={18}
              reverse
              raised
            />
          </TouchableOpacity>
        )}

        {description !== '' && (
          <View style={styles.save}>
            {saveToggle && (
              <TouchableOpacity
                onPress={() => {
                  if (addingReason) {
                    reasons.push({
                      time,
                      title,
                      description,
                      reasonDate: newDate,
                      important,
                      attachmentList,
                    });
                    saveReason();
                    setToggleInput(false);
                    setSaveToggle(false);
                  } else {
                    var index = reasons.findIndex(
                      (x) => x.description === reason.description,
                    );
                    console.log(index);
                    if (index !== null) {
                      reasons[index] = {
                        time,
                        title,
                        description,
                        reasonDate: newDate,
                        important,
                        attachmentList,
                      };
                      saveReason();
                      setToggleInput(false);
                      setSaveToggle(false);
                    }
                  }
                }}
                style={[styles.option]}
              >
                <Icon
                  name="save"
                  type="font-awesome"
                  color="#10375C"
                  size={18}
                  reverse
                  raised
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {attachmentList.length !== 0 && (
        <View
          style={[
            styles.attachmentContainer,
            { borderColor: Colors.secondary },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontFamily: 'SFUIText-Regular',
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              Attachments
            </Text>
          </View>

          <FlatList
            data={attachmentList}
            keyExtractor={(item) => item.uri}
            numColumns={3}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setImage(item.uri);
                    setModalVisible(true);
                  }}
                  onLongPress={() => handleLongPress(item)}
                  style={styles.imageContainer}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.noteContainer}>
            <Text
              style={[styles.noteTextHeader, { color: colors.text }]}
            >
              Note on Attachments
            </Text>
            <Text style={[styles.noteText, { color: colors.text }]}>
              Attachments are indexed from storage and will be removed
              if deleted from storage.
            </Text>
          </View>
        </View>
      )}
      <Modal
        ref={modalRef}
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setModalVisible(false)}
      >
        <View>
          <Image
            source={{ uri: image }}
            style={{
              height: window.height - 100,
              width: window.width,
            }}
          />
          <View style={{ alignSelf: 'center' }}>
            <Icon
              name="trash-o"
              type="font-awesome"
              color="#10375C"
              size={18}
              reverse
              onPress={() => {
                attachmentList.splice(
                  attachmentList.findIndex(
                    (key) => key.uri === image,
                  ),
                  1,
                );
                setModalVisible(false);
                setSaveToggle(true);
              }}
            />
          </View>
        </View>
      </Modal>
      <AlertPro
        ref={alertRef}
        onConfirm={() => {
          deleteReasonFromList(deletedValue);
          alertRef.current.close();
        }}
        title="Delete Confirmation"
        message="Are you sure to delete the reason ?"
        textCancel="Cancel"
        textConfirm="Delete"
        onCancel={() => alertRef.current.close()}
        customStyles={{
          mask: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          container: {
            borderWidth: 1,
            borderColor: colors.card,
            shadowColor: colors.text,
            shadowOpacity: 0.1,
            shadowRadius: 10,
            borderRadius: 10,
            backgroundColor: colors.primary,
            elevation: 5,
          },
          buttonCancel: {
            backgroundColor: 'transparent',
            borderColor: Colors.secondary,
            borderWidth: 2,
            borderRadius: 10,
          },
          buttonConfirm: {
            backgroundColor: 'transparent',
            borderColor: Colors.errorBackground,
            borderWidth: 2,
            borderRadius: 10,
          },
          title: {
            fontFamily: 'SFUIText-Bold',
            color: colors.text,
          },
          message: {
            fontFamily: 'SFUIText-Medium',
            color: colors.text,
          },
          textCancel: {
            fontFamily: 'SFUIText-Medium',
            color: colors.text,
          },
          textConfirm: {
            fontFamily: 'SFUIText-Medium',
            color: colors.text,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    marginHorizontal: 5,
  },
  optioncontainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  option: {
    marginRight: 5,
    color: 'white',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },

  save: {
    backgroundColor: 'transparent',
    flexDirection: 'row-reverse',
  },
  input: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: '#404040',
    maxHeight: 200,
    fontFamily: 'SFUIText-Regular',
  },
  description: {
    position: 'relative',
  },
  textContainer: {
    justifyContent: 'flex-end',
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  reasonText: {
    color: '#fff',
    fontSize: 20,
    marginHorizontal: 5,
    marginVertical: 10,
    fontFamily: 'SFUIText-Regular',
  },
  eventTitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    marginHorizontal: 10,
    fontFamily: 'SFUIText-Medium',
  },
  datePickerContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  timepicker: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 15,
  },
  attachmentContainer: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 10,
  },
  time: {
    fontSize: 16,
    marginHorizontal: 10,
    fontFamily: 'SFUIText-Regular',
  },
  imageContainer: {
    margin: 5,
  },
  image: {
    height: 100,
    width: window.width / 3 - 20,
  },
  datePickerControl: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  noteText: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
    textAlign: 'justify',
  },
  noteTextHeader: {
    fontFamily: ' SFUIText-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  noteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default ReasonScreen;
