import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Context as EventContext } from '../context/EventContext';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import Timeline from 'react-native-timeline-flatlist';

import customStyles from '../constants/styles';
import { dateFormat } from '../helpers/DateFormatter';
import Colors from '../constants/colors';

console.disableYellowBox = true;

const height = Dimensions.get('window').height;
const EventDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { deleteEvent } = useContext(EventContext);
  const [reasonList, setReasonList] = useState([]);
  const [visible, setVisible] = React.useState(false);

  const {
    id,
    eventTitle,
    eventDescription,
    date,
    category,
    color,
    reasons,
    starred,
    done,
  } = route.params;

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: false,
      });
      async function setup() {
        setReasonList(reasons);
      }
      setup();
    }, [navigation, reasons]),
  );

  const menuOptions = {
    optionsContainer: {
      backgroundColor: colors.background,
      borderRadius: 10,
      maxWidth: 180,
      color: colors.text,
      flex: 1,
    },
    optionsWrapper: {
      backgroundColor: 'transparent',
      color: colors.text,
    },
    optionWrapper: {
      backgroundColor: 'transparent',
      margin: 5,
      color: colors.text,
    },
    optionTouchable: {
      underlayColor: 'transparent',
      activeOpacity: 70,
      color: colors.text,
    },
    optionText: {
      color: colors.text,
    },
  };
  const onEventPress = (event) => {
    navigation.navigate('Reason', {
      id: id,
      reason: {
        time: event.time,
        title: event.title,
        description: event.description,
        reasonDate: event.reasonDate,
        important: event.important,
        attachmentList: event.attachmentList,
      },
      addingReason: false,
      editingReason: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.EventNameContainer,
          {
            backgroundColor: color,
            height: height * 0.2,
          },
        ]}
      >
        <View style={styles.backArrow}>
          <View>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Icon
                name="arrow-left"
                type="font-awesome"
                color={colors.text}
                size={22}
              />
            </TouchableOpacity>
          </View>
          <View style={customStyles.subMenu}>
            <Menu renderer={renderers.ContextMenu}>
              <MenuTrigger
                children={
                  <Icon
                    name="subject"
                    type="material"
                    color={colors.text}
                    size={30}
                    containerStyle={styles.addIcon}
                  />
                }
                customStyles={{
                  color: colors.primary,
                }}
              />
              <MenuOptions customStyles={menuOptions}>
                <MenuOption
                  onSelect={() =>
                    navigation.navigate('AddEvent', {
                      id: id,
                      name: eventTitle,
                      description: eventDescription,
                      eventDate: date,
                      eventCategory: category,
                      eventColor: color,
                      reasons: reasonList,
                      eventStarred: starred,
                      done: done,
                      action: 'edit',
                    })
                  }
                >
                  <View style={styles.menuItem}>
                    <Icon
                      name="edit"
                      type="font-awesome"
                      color={colors.text}
                      size={20}
                      containerStyle={styles.addIcon}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        { color: colors.text },
                      ]}
                    >
                      Edit
                    </Text>
                  </View>
                </MenuOption>
                <MenuOption
                  onSelect={() =>
                    deleteEvent(id, () => navigation.navigate('Home'))
                  }
                >
                  <View style={styles.menuItem}>
                    <Icon
                      name="trash-o"
                      type="font-awesome"
                      color={colors.text}
                      size={20}
                      containerStyle={styles.addIcon}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        { color: colors.text },
                      ]}
                    >
                      Delete
                    </Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <View style={styles.eventTitle}>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Text
              style={[styles.EventNameStyle, { color: colors.text }]}
            >
              {eventTitle}
            </Text>
          </TouchableOpacity>
          <Overlay
            isVisible={visible}
            onBackdropPress={() => setVisible(false)}
            overlayStyle={[
              styles.overlay,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[styles.EventNameStyle, { color: colors.text }]}
            >
              {eventTitle}
            </Text>
            <Text style={[styles.dateText, { color: colors.text }]}>
              {eventDescription}
            </Text>
          </Overlay>
        </View>
        <View style={styles.dateCategoryContainer}>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {dateFormat(date)}
          </Text>
          {starred && (
            <Icon
              name="star"
              type="font-awesome"
              color={Colors.lightBlack}
              size={25}
              iconStyle={styles.star}
            />
          )}
          <Text style={[styles.categoryText, { color: colors.text }]}>
            {category}
          </Text>
        </View>
      </View>
      <View style={styles.reasonsContainer}>
        <View style={styles.AddReason}>
          <Text
            style={[styles.AddReasonText, { color: colors.text }]}
          >
            Reasons
          </Text>
        </View>
        <Timeline
          data={
            reasonList
              ? reasonList.sort(function (a, b) {
                  return (
                    new Date(a.reasonDate) - new Date(b.reasonDate)
                  );
                })
              : []
          }
          renderDetail={(rowData, sectionID, rowID) => {
            return (
              <View>
                <View style={styles.oneReasonContainer}>
                  <Text
                    style={[
                      styles.reasonTitle,
                      { color: Colors.secondary },
                    ]}
                  >
                    {rowData.title}
                  </Text>
                  {rowData.important === true && (
                    <Icon
                      name="star"
                      type="font-awesome"
                      color={Colors.lightBlack}
                      size={20}
                      iconStyle={styles.star}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.reasonDescription,
                    { color: colors.text },
                  ]}
                >
                  {rowData.description}
                </Text>
              </View>
            );
          }}
          lineColor={Colors.secondary}
          circleColor={Colors.secondary}
          separator={true}
          onEventPress={onEventPress}
          timeStyle={[
            styles.timelineTime,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          descriptionStyle={[
            styles.timelineDescription,
            { color: colors.text, backgroundColor: colors.primary },
          ]}
          style={{ marginHorizontal: 10 }}
          titleStyle={{ color: colors.border }}
          eventDetailStyle={[
            styles.timelineEventDetail,
            { backgroundColor: colors.primary },
          ]}
          timeContainerStyle={{ minWidth: 60 }}
        />
      </View>
      <View style={styles.buttonView}>
        <Icon
          reverse
          raised
          name="plus"
          type="font-awesome"
          color="#10375C"
          size={25}
          onPress={() => {
            navigation.navigate('Reason', {
              id: id,
              reason: {
                time: '',
                title: '',
                description: '',
                reasonDate: new Date(date),
                important: false,
                attachmentList: [],
              },
              addingReason: true,
              editingReason: false,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  EventNameContainer: {
    height: 180,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  EventNameStyle: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 25,
    padding: 5,
    margin: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  AddReason: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  AddReasonText: {
    alignSelf: 'center',
    fontFamily: 'SFUIText-Semibold',
    fontSize: 25,
  },
  addIcon: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  reasonsContainer: {
    flex: 1,
    //  backgroundColor: '#202020',
    marginVertical: 10,
    borderRadius: 10,
  },
  reasonContainer: {
    backgroundColor: '#202020',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  buttonView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 5,
    backgroundColor: 'transparent',
    borderColor: 'blue',
    borderRadius: 1,
  },
  timelineTime: {
    textAlign: 'center',
    padding: 5,
    borderRadius: 13,
    fontFamily: 'SFUIText-Regular',
  },
  timelineDescription: {
    borderRadius: 10,
    fontSize: 18,
    fontFamily: 'SFUIText-Regular',
  },
  timelineEventDetail: {
    borderRadius: 10,
    padding: 5,
  },
  categoryText: {
    fontSize: 18,
    fontFamily: 'SFUIText-Regular',
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'SFUIText-Regular',
  },
  dateCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 2,
  },
  eventTitle: {
    flex: 3,
    justifyContent: 'center',
  },
  menuText: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
  },
  backArrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 2,
  },
  oneReasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reasonTitle: {
    fontFamily: 'SFUIText-Semibold',
  },
  reasonDescription: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 18,
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default EventDetailScreen;
