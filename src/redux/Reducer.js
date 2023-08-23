import {
  InfoActionTypes,
  DriverInfoActionTypes,
  SET_USER_INFO,
  SET_DRIVER_INFO,
  SET_DRIVER_ACTIVITY,
  SET_DRIVER_RIDE_CONNECT_STATE,
  SET_DRIVER_RIDE_PHASE_ONE,
  SET_DRIVER_RIDE_PHASE_TWO,
} from './Action';

// export interface State {
//   userInfo: string;
//   driverInfo: string;
// }

const initialState = {
  userInfo: '',
  driverInfo: '',
  driverActivity: '',
  driverRideConnectState: false,
  driverRidePhaseOne: false,
  driverRidePhaseTwo: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      console.log(
        'Redux reducer: saving User information ===>',
        action.payload,
      );
      return {
        ...state,
        userInfo: action.payload,
      };
    case SET_DRIVER_INFO:
      console.log(
        'Redux reducer: saving Drivers information ===>',
        action.payload,
      );
      return {
        ...state,
        driverInfo: action.payload,
      };
    case SET_DRIVER_ACTIVITY:
      console.log(
        'Redux reducer: saving Drivers activity ===>',
        action.payload,
      );
      return {
        ...state,
        driverActivity: action.payload,
      };
    case SET_DRIVER_RIDE_CONNECT_STATE:
      console.log(
        'Redux reducer: saving Drivers ride Connect State ===>',
        action.payload,
      );
      return {
        ...state,
        driverRideConnectState: action.payload,
      };
    case SET_DRIVER_RIDE_PHASE_ONE:
      console.log(
        'Redux reducer: saving Drivers ride Phase one ===>',
        action.payload,
      );
      return {
        ...state,
        driverRidePhaseOne: action.payload,
      };
    case SET_DRIVER_RIDE_PHASE_TWO:
      console.log(
        'Redux reducer: saving Drivers ride Phase two ===>',
        action.payload,
      );
      return {
        ...state,
        driverRidePhaseTwo: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
