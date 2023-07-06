import {
  ActionTypes,
  SET_APP_STATE,
  InfoActionTypes,
  SET_USER_INFO,
} from './Action';

export interface State {
  appState: string;
  userInfo: object;
}

const initialState: State = {
  appState: '',
  userInfo: {},
};

const reducer = (
  state = initialState,
  action: ActionTypes | InfoActionTypes,
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
    default:
      return state;
  }
};

export default reducer;
