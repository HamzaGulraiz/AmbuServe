// actions.ts
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_DRIVER_INFO = 'SET_DRIVER_INFO';

// interface SetUserInfoAction {
//   type: typeof SET_USER_INFO;
//   payload: string;
// }

// export type InfoActionTypes = SetUserInfoAction;

export const setUserInfo = userInfo => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

// interface SetDriverInfoAction {
//   type: typeof SET_DRIVER_INFO;
//   payload: string;
// }

// export type DriverInfoActionTypes = SetDriverInfoAction;

export const setDriverInfo = driverInfo => ({
  type: SET_DRIVER_INFO,
  payload: driverInfo,
});
