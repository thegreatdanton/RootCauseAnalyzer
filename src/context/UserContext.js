import CreateDataContext from './CreateDataContext';
import AsyncStorage from '@react-native-community/async-storage';

const UserReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_user':
      return state;
    case 'remove_user':
      return [];
    case 'save_user':
      return { user: action.payload };
    default:
      return state;
  }
};

const fetchUser = (dispatch) => {
  return async () => {
    try {
      var result = await AsyncStorage.getItem('user');
      var user = JSON.parse(result);
    } catch (error) {}
    dispatch({
      type: 'fetch_user',
      payload: user,
    });
  };
};

const saveUser = (dispatch) => {
  return async ({ userName, userPhoto, googleToken }) => {
    console.log({ userName });
    try {
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({ userName, userPhoto, googleToken }),
      );
    } catch (error) {}
    dispatch({
      type: 'save_user',
      payload: { userName, userPhoto, googleToken },
    });
  };
};

const removeUser = (dispatch) => {
  return async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {}
    dispatch({
      type: 'remove_user',
      payload: null,
    });
  };
};

export const { Context, Provider } = CreateDataContext(
  UserReducer,
  {
    fetchUser,
    saveUser,
    removeUser,
  },
  [],
);
