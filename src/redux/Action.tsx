// actions.ts
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_DRIVER_INFO = 'SET_DRIVER_INFO';
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
  payload: string;
}

export type InfoActionTypes = SetUserInfoAction;

export const setUserInfo = (userInfo: string): SetUserInfoAction => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

interface SetDriverInfoAction {
  type: typeof SET_DRIVER_INFO;
  payload: object;
}

export type DriverInfoActionTypes = SetDriverInfoAction;

export const setDriverInfo = (driverInfo: object): SetDriverInfoAction => ({
  type: SET_DRIVER_INFO,
  payload: driverInfo,
});
