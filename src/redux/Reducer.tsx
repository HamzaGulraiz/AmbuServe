import {
  ActionTypes,
  SET_APP_STATE,
  InfoActionTypes,
  DriverInfoActionTypes,
  SET_USER_INFO,
  SET_DRIVER_INFO,
} from './Action';

export interface State {
  appState: string;
  userInfo: string;
  driverInfo: object;
}

const initialState: State = {
  appState: '',
  userInfo: '',
  driverInfo: {},
};

const reducer = (
  state = initialState,
  action: ActionTypes | InfoActionTypes | DriverInfoActionTypes,
): State => {
  switch (action.type) {
    case SET_APP_STATE:
      return {
        ...state,
        appState: action.payload,
      };
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case SET_DRIVER_INFO:
      return {
        ...state,
        driverInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
