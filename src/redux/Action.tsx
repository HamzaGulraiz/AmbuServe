// actions.ts
export const SET_THEME = 'SET_THEME';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_APP_STATE = 'SET_APP_STATE';

interface SetAppStateAction {
  type: typeof SET_APP_STATE;
  payload: string;
}

export type ActionTypes = SetAppStateAction;

export const setAppState = (appState: string): SetAppStateAction => ({
  type: SET_APP_STATE,
  payload: appState,
});

interface SetUserInfoAction {
  type: typeof SET_USER_INFO;
  payload: object;
}

export type InfoActionTypes = SetUserInfoAction;

export const setUserInfo = (userInfo: object): SetUserInfoAction => ({
  type: SET_USER_INFO,
  payload: userInfo,
});
