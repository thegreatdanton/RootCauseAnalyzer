import CreateDataContext from './CreateDataContext';
import AsyncStorage from '@react-native-community/async-storage';

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'get_Events':
      return action.payload;
    case 'add_Event':
      return [
        ...state,
        {
          id: action.payload.id,
          eventTitle: action.payload.eventTitle,
          eventDescripton: action.payload.eventDescripton,
          date: action.payload.date,
          category: action.payload.category,
          color: action.payload.color,
          reasons: action.payload.reasons,
          starred: action.payload.starred,
          done: action.payload.done,
        },
      ];
    case 'edit_Event':
      return state.map((event) => {
        return event.id === action.payload.id
          ? action.payload
          : event;
      });
    case 'delete_Event':
      return state.filter((event) => event.id !== action.payload);
    case 'add_Reason':
      return state.map((event) => {
        return event.id === action.payload.id
          ? action.payload
          : event;
      });

    case 'edit_Reason':
      return state.map((event) => {
        return event.id === action.payload.id
          ? action.payload
          : event;
      });
    case 'delete_Reason':
      return state.map((event) => {
        return event.id === action.payload.id
          ? action.payload
          : event;
      });
    default:
      return state;
  }
};

const addEvent = (dispatch) => {
  return async (
    eventTitle,
    eventDescription,
    date,
    category,
    color,
    reasons,
    starred,
    done,
    callback,
  ) => {
    try {
      var id = Math.floor(Math.random() * 9999);
      await AsyncStorage.setItem(
        id.toString(),
        JSON.stringify({
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
    } catch (err) {}
    dispatch({
      type: 'add_Event',
      payload: {
        id,
        eventTitle,
        eventDescription,
        date,
        category,
        color,
        reasons,
        starred,
        done,
      },
    });
    if (callback) {
      callback();
    }
  };
};

const editEvent = (dispatch) => {
  return async (
    eventTitle,
    eventDescription,
    date,
    category,
    color,
    reasons,
    starred,
    done,
    id,
    callback,
  ) => {
    await AsyncStorage.mergeItem(
      id.toString(),
      JSON.stringify({
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
    dispatch({
      type: 'edit_Event',
      payload: {
        id: id,
        eventTitle: eventTitle,
        eventDescription: eventDescription,
        date: date,
        category: category,
        color: color,
        reasons: reasons,
        starred: starred,
        done: done,
      },
    });
    if (callback) {
      callback();
    }
  };
};

const deleteEvent = (dispatch) => {
  return async (id, callback) => {
    try {
      await AsyncStorage.removeItem(id.toString());
      dispatch({ type: 'delete_Event', payload: id });
      if (callback) {
        callback();
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const getEvents = (dispatch) => {
  return async () => {
    try {
      //await AsyncStorage.clear();
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

      dispatch({ type: 'get_Events', payload: events });
    } catch (error) {
      console.error(error);
    }
  };
};

const addReason = (dispatch) => {
  return async (
    id,
    eventTitle,
    eventDescription,
    date,
    category,
    color,
    reasons,
    starred,
    done,
    callback,
  ) => {
    console.log(reasons);
    await AsyncStorage.mergeItem(
      id.toString(),
      JSON.stringify({
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
    dispatch({
      type: 'add_Reason',
      payload: {
        id,
        eventTitle,
        eventDescription,
        date,
        category,
        color,
        reasons,
        starred,
        done,
      },
    });

    if (callback) {
      callback();
    }
  };
};
const editReason = (dispatch) => {
  return (id, reason, callback) => {
    dispatch({
      type: 'edit_Reason',
      payload: { id, reason },
    });

    if (callback) {
      callback();
    }
  };
};
const deleteReason = (dispatch) => {
  return (id, reason, callback) => {
    dispatch({
      type: 'delete_Reason',
      payload: { id, reason },
    });

    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = CreateDataContext(
  eventReducer,
  {
    getEvents,
    addEvent,
    editEvent,
    deleteEvent,
    addReason,
  },
  [
    // {
    //   id: 1,
    //   eventTitle:
    //     'Sample Event #1 This is a big event and may extend to next line and probably doesnt fit to new line and I am typing something that I dont know',
    //   reasons: [
    //     'This is a very big reason and I am happy',
    //     'Reason 2',
    //     'Reason 3',
    //   ],
    //   category: 'Personal',
    // },
    // {
    //   id: 2,
    //   eventTitle:
    //     'Sample Event #2 This is a big event and may extend to next line and probably doesnt fit',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'family',
    // },
    // {
    //   id: 3,
    //   eventTitle: 'Sample Event #3',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'Personal',
    // },
    // {
    //   id: 4,
    //   eventTitle: 'Sample Event #4',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'Personal',
    // },
    // {
    //   id: 5,
    //   eventTitle: 'Sample Event #5',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'Friends',
    // },
    // {
    //   id: 6,
    //   eventTitle: 'Sample Event #6',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'Personal',
    // },
    // {
    //   id: 7,
    //   eventTitle: 'Sample Event #7',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'Personal',
    // },
    // {
    //   id: 8,
    //   eventTitle: 'Sample Event #8',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'Personal',
    // },
    // {
    //   id: 9,
    //   eventTitle: 'Sample Event #9',
    //   reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
    //   category: 'Personal',
    // },
  ],
);
