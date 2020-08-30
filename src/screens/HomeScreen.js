import React, { useContext, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { Text, Card, Icon, SearchBar } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Context as EventContext } from '../context/EventContext';
import DateTime from '../components/DateTime';
import customStyles from '../constants/styles';
import Category from '../components/Category';
import Colors from '../constants/colors';
import EmptyEvents from '../components/EmptyEvents';
import { showMessage } from 'react-native-flash-message';
import AlertPro from 'react-native-alert-pro';

const HomeScreen = ({ navigation }) => {
  const { state, deleteEvent, getEvents, editEvent } = useContext(
    EventContext,
  );
  const alertRef = useRef();
  const { colors } = useTheme();
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [done, setDone] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [eventTitle, setEventTitle] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        title: 'Events',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'SFUIText-Bold',
          color: colors.text,
          fontSize: 20,
        },
      });
      function setup() {
        getEvents();
        setEvents(state);
        if (state.length !== 0) {
          setShowSearchButton(true);
        } else {
          setShowSearchButton(false);
          setShowSearch(false);
        }
      }
      setup(getEvents);
    }, [getEvents]),
  );

  const searchEvents = (value) => {
    setSearchText(value);
    if (value !== '') {
      const searchData = events.filter((item) => {
        const itemData = `${item.eventTitle.toUpperCase()}`;
        const textData = value.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setSearchResults(searchData);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    if (searchResults) {
      setSearchResults(null);
      setShowSearch(false);
    } else {
      setSearchResults([]);
      setShowSearch(!showSearch);
      setSearchText('');
    }
  };

  const renderEmptyList = () => {
    return <EmptyEvents />;
  };

  const deleteEventFromList = (id) => {
    events.filter((key) => key.id === id);
    deleteEvent(id);
  };
  return (
    <View style={styles.containerStyle}>
      {showSearch && (
        <SearchBar
          showLoading={searchText === '' ? false : true}
          placeholder="Search events here !!"
          value={searchText}
          onChangeText={(value) => searchEvents(value)}
          autoFocus
          containerStyle={customStyles.searchContainer}
          inputContainerStyle={[
            customStyles.searchInputContainer,
            { backgroundColor: colors.primary },
          ]}
          inputStyle={[
            customStyles.searchInputStyle,
            { color: colors.text },
          ]}
        />
      )}
      <View style={styles.listItemView}>
        <SwipeListView
          data={
            searchResults
              ? searchResults.sort(function (a, b) {
                  return new Date(b.date) - new Date(a.date);
                })
              : events.sort(function (a, b) {
                  if (a !== null && b != null) {
                    return new Date(b.date) - new Date(a.date);
                  }
                  return 0;
                })
          }
          keyExtractor={(event) =>
            event !== null && event.id.toString()
          }
          extraData={searchResults}
          scrollEnabled
          ListEmptyComponent={
            searchResults ? null : renderEmptyList()
          }
          renderItem={(data) => {
            return (
              <View>
                {data.length !==0 && (<TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    navigation.navigate('EventDetail', {
                      id: data.item.id,
                      eventTitle: data.item.eventTitle,
                      date: data.item.date,
                      category: data.item.category,
                      color: data.item.color,
                      reasons: data.item.reasons,
                      starred: data.item.starred,
                      done: data.item.done,
                    });
                  }}
                >
                  <Card
                    containerStyle={[
                      styles.cardStyle,
                      {
                        backgroundColor:
                          data && data.item
                            ? data.item.color
                            : 'transparent',
                      },
                    ]}
                    wrapperStyle={styles.cardContent}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles.titleView}>
                       {data.item && (<Text style={styles.titleStyle}>
                          {data.item.eventTitle}
                        </Text>)}
                      </View>
                      {/* <TouchableOpacity
                      onPress={() => deleteEvent(data.item.id)}
                      style={styles.deleteView}
                    >
                      <Icon
                        type="font-awesome"
                        name="angle-left"
                        size={30}
                        color={Colors.primary}
                      />
                      <Icon
                        type="font-awesome"
                        name="angle-right"
                        size={30}
                        color={Colors.primary}
                      />
                    </TouchableOpacity> */}
                      {data.item.starred && (
                        <Icon
                          name="star"
                          type="font-awesome"
                          color={Colors.lightBlack}
                          size={20}
                          containerStyle={styles.star}
                        />
                      )}
                    </View>
                    <View style={customStyles.optionsContainer}>
                      <Category name={data.item.category} />
                      <DateTime eventDate={data.item.date} />
                    </View>
                  </Card>
                </TouchableOpacity>)}
              </View>
            );
          }}
          renderHiddenItem={(data, rowMap) => {
            return (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  onPress={() => {
                    setEventId(data.item.id);
                    setEventTitle(data.item.eventTitle);
                    alertRef.current.open();
                  }}
                  style={styles.deleteView}
                >
                  <Icon
                    type="font-awesome"
                    name="trash-o"
                    size={20}
                    color={Colors.secondary}
                    reverse
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    //data.item.done === true;
                    showMessage({
                      message: 'Event mark as done is coming soon',
                      type: 'info',
                    });
                    // editEvent(
                    //   data.item.eventTitle,
                    //   data.item.eventDescription,
                    //   data.item.date,
                    //   data.item.category,
                    //   data.item.color,
                    //   data.item.reasons,
                    //   data.item.starred,
                    //   done,
                    //   data.item.id,
                    // );
                  }}
                  style={styles.deleteView}
                >
                  <Icon
                    type="font-awesome-5"
                    name="check-square"
                    size={20}
                    color={Colors.secondary}
                    reverse
                    solid={data.item.done ? false : true}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          rightOpenValue={-70}
          leftOpenValue={70}
        />
      </View>
      <View style={styles.buttonView}>
        {showSearchButton && (
          <Icon
            reverse
            raised
            //color="#20686c"
            name="search"
            type="font-awesome"
            color="#10375C"
            size={25}
            onPress={() => clearSearch()}
          />
        )}

        <Icon
          reverse
          raised
          name="plus"
          type="font-awesome"
          color="#10375C"
          size={25}
          onPress={() =>
            navigation.navigate('AddEvent', {
              name: '',
              event: null,
              action: null,
            })
          }
        />
      </View>
      <AlertPro
        ref={alertRef}
        onConfirm={() => {
          deleteEventFromList(eventId);
          alertRef.current.close();
        }}
        title="Delete Confirmation"
        message={`Are you sure to delete ${eventTitle}?`}
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
            backgroundColor: Colors.secondary,
            borderColor: Colors.secondary,
            borderWidth: 2,
            borderRadius: 10,
          },
          buttonConfirm: {
            backgroundColor: Colors.secondary,
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
            color: Colors.white,
          },
          textConfirm: {
            fontFamily: 'SFUIText-Medium',
            color: Colors.white,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
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
  addButton: {
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'transparent',
    elevation: 20,
  },
  listItemView: { flex: 1 },
  cardStyle: {
    borderRadius: 10,
    flex: 1,
    borderColor: 'transparent',
  },
  cardContent: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  titleStyle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SFUIText-Medium',
    marginRight: 10,
  },
  titleView: {
    alignSelf: 'flex-start',
    flex: 0.85,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.1,
    marginHorizontal: 25,
    flexDirection: 'row',
  },
  star: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBack: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingLeft: 15,
    flex: 1,
  },
});

export default HomeScreen;
