// actions.ts
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_DRIVER_INFO = 'SET_DRIVER_INFO';
export const SET_DRIVER_RIDE_CONNECT_STATE = 'SET_DRIVER_RIDE_CONNECT_STATE';
export const SET_DRIVER_RIDE_PHASE_ONE = 'SET_DRIVER_RIDE_PHASE_ONE';
export const SET_DRIVER_RIDE_PHASE_TWO = 'SET_DRIVER_RIDE_PHASE_TWO';

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

export const setDriverRideConnectedState = state => ({
  type: SET_DRIVER_RIDE_CONNECT_STATE,
  payload: state,
});

export const setDriverRidePhaseOne = state => ({
  type: SET_DRIVER_RIDE_PHASE_ONE,
  payload: state,
});

export const setDriverRidePhaseTwo = state => ({
  type: SET_DRIVER_RIDE_PHASE_TWO,
  payload: state,
});
