import {
  InfoActionTypes,
  DriverInfoActionTypes,
  SET_USER_INFO,
  SET_DRIVER_INFO,
} from './Action';

// export interface State {
//   userInfo: string;
//   driverInfo: string;
// }

const initialState = {
  userInfo: '',
  driverInfo: '',
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
    default:
      return state;
  }
};

export default reducer;
