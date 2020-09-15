/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Text, Icon } from 'react-native-elements';
import { Select, SelectItem, IndexPath } from '@ui-kitten/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context as EventContext } from '../context/EventContext';
import Categories from '../constants/Categories';
import customStyles from '../constants/styles';
import ColorPicker from '../components/ColorPicker';
import { useTheme } from '@react-navigation/native';
import Colors from '../constants/colors';
import { showMessage } from 'react-native-flash-message';
import { datetimeFormat } from '../helpers/DateFormatter';

const height = Dimensions.get('window').height;

const AddEventScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const {
    id,
    name,
    description,
    eventDate,
    eventCategory,
    eventColor,
    reasons,
    eventStarred,
    done,
    action,
  } = route.params;
  const { addEvent, editEvent } = useContext(EventContext);

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, seteventDescription] = useState('');
  const [date, setDate] = useState(new Date(Date.now()));
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [category, setCategory] = useState('Personal');
  const [categoryIndex, setCategoryIndex] = useState(
    new IndexPath(0),
  );
  const [color, setColor] = useState('#E74C3C');
  const [, setDisabled] = useState(true);
  const [starred, SetStarred] = useState(false);

  const titleRef = React.createRef();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      // eventTitle: 'Add Event',
      // headerStyle: { backgroundColor: colors.background },
      // headerTintColor: colors.text,
      // headerTitleStyle: {
      //   fontWeight: 'bold',
      //   color: colors.text,
      // },
    });
    if (id) {
      setEventTitle(name);
      seteventDescription(description);
      setDate(new Date(eventDate));
      setCategory(eventCategory);
      setColor(eventColor);
      setDisabled(false);
      SetStarred(eventStarred);
    }
  }, []);

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShow(false);
    } else {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      if (mode === 'date') {
        setMode('time');
        setShow(true);
      }
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
  const setTitleBackground = (background) => {
    setColor(background);
  };

  const enableButton = (value) => {
    if (value !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const selectCategory = (index) => {
    setCategoryIndex(index);
    setCategory(Categories[index - 1].value);
  };

  var formattedTime = datetimeFormat(date);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={[styles.titleContainer, { backgroundColor: color }]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.pop()}
              style={{
                alignSelf: 'flex-start',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                margin: 10,
              }}
            >
              <Icon
                name="arrow-left"
                type="font-awesome"
                color={colors.text}
                size={22}
                containerStyle={{
                  borderColor: 'black',
                  borderRadius: 1,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: colors.text,
                fontFamily: 'SFUIText-Bold',
                fontSize: 40,
                flex: 5,
                textAlign: 'center',
                marginRight: 40,
                paddingTop: 10,
              }}
            >
              Event
            </Text>
          </View>
          <View style={{ flex: 6 }}>
            <TextInput
              ref={titleRef}
              value={eventTitle}
              placeholder="Add Event title here"
              placeholderTextColor={colors.card}
              onChangeText={(value) => {
                setEventTitle(value);
                enableButton(value);
              }}
              style={[
                styles.titleInput,
                { color: colors.text, height: height * 0.2 },
              ]}
              maxLength={40}
              multiline={true}
              clearButtonMode="unless-editing"
              selectionColor="black"
              autoFocus
              onBlur={Keyboard.dismiss}
            />
          </View>
        </View>
        <View style={styles.inputsContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <View
            style={[
              customStyles.eventDescription,
              { backgroundColor: colors.primary },
            ]}
          >
            <TextInput
              placeholder="Add event description here"
              placeholderTextColor={colors.border}
              multiline={true}
              autoGrow={true}
              style={[styles.input, { color: colors.text }]}
              value={eventDescription}
              onChangeText={(value) => {
                seteventDescription(value);
              }}
            />
          </View>
          <View style={styles.timeAndCategoryContainer}>
            <View
              style={{ flex: 1, justifyContent: 'space-between' }}
            >
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity
                onPress={showDatepicker}
                style={[
                  styles.datePickerContainer,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.time, { color: colors.text }]}>
                  {formattedTime}
                </Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(date)}
                  mode={mode}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                borderRadius: 20,
              }}
            >
              <Text style={styles.inputLabel}>Category</Text>
              <View
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                  elevation: 1,
                  justifyContent: 'center',
                }}
              >
                <Select
                  selectedIndex={categoryIndex}
                  children={Categories.map((item) => {
                    return (
                      <SelectItem
                        title={item.value}
                        style={{
                          borderTopColor: Colors.secondary,
                          borderWidth: 1,
                          borderRadius: 5,
                          fontFamily: 'SFUIText-Regular',
                        }}
                      />
                    );
                  })}
                  onSelect={(index) => selectCategory(index)}
                  value={category}
                  style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    borderRadius: 10,
                    fontFamily: 'SFUIText-Regular',
                  }}
                />
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.inputLabel}>Color</Text>
            <View
              style={[
                styles.colorPicker,
                { backgroundColor: colors.primary },
              ]}
            >
              <ColorPicker setTitleBackground={setTitleBackground} />
            </View>
          </View>
          <View
            style={[
              styles.starContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            {!starred && (
              <Text style={[styles.text, { color: colors.text }]}>
                Mark as important
              </Text>
            )}
            {starred && (
              <Text style={[styles.text, { color: colors.text }]}>
                Marked as important
              </Text>
            )}
            {!starred && (
              <Icon
                name="star"
                type="font-awesome"
                color={Colors.grey}
                onPress={() => SetStarred(true)}
                size={30}
                iconStyle={styles.star}
              />
            )}
            {starred && (
              <Icon
                name="star"
                type="font-awesome"
                color={Colors.lightBlack}
                onPress={() => SetStarred(false)}
                size={30}
                iconStyle={styles.star}
              />
            )}
          </View>
          <View style={{ flex: 1, padding: 10 }}>
            <TouchableOpacity
              onPress={() => {
                if (eventTitle === '') {
                  showMessage({
                    message: 'Event title is mandatory',
                    type: 'warning',
                  });
                } else {
                  if (action) {
                    showMessage({
                      message: 'Event Saved',
                      type: 'info',
                    });
                    editEvent(
                      eventTitle,
                      eventDescription,
                      date,
                      category,
                      color,
                      reasons,
                      starred,
                      done,
                      id,
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
                  } else {
                    showMessage({
                      message: 'Event Saved',
                      type: 'info',
                    });
                    addEvent(
                      eventTitle,
                      eventDescription,
                      date,
                      category,
                      color,
                      [],
                      starred,
                      false,
                      () => navigation.pop(),
                    );
                  }
                }
              }}
              style={[
                styles.saveContainer,
                { backgroundColor: color },
              ]}
            >
              <Text
                style={[
                  styles.saveTitleStyle,
                  { color: colors.text },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  titleInput: {
    fontSize: 30,
    fontFamily: 'SFUIText-Regular',
    flex: 4,
    textAlign: 'center',
  },
  input: {
    fontSize: 20,
    marginHorizontal: 10,
    fontFamily: 'SFUIText-Regular',
    textAlign: 'center',
    height: 100,
  },
  inputLabel: {
    fontSize: 20,
    color: 'green',
    marginBottom: 5,
    marginTop: 10,
    fontFamily: 'SFUIText-Regular',
  },
  inputsContainer: {
    marginHorizontal: 10,
    flex: 1,
  },
  time: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'SFUIText-Regular',
  },
  colorPicker: {
    backgroundColor: '#202020',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  save: {
    height: 50,
    width: 150,
    borderRadius: 10,
  },
  saveContainer: {
    height: 50,
    width: 150,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  saveTitleStyle: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'SFUIText-Regular',
  },
  datePickerContainer: {
    backgroundColor: '#202020',
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  timeAndCategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 5,
    borderRadius: 10,
  },
  star: {
    elevation: 10,
  },
  eventDescription: {
    borderRadius: 10,
  },
});

export default AddEventScreen;
