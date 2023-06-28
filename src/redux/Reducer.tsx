// reducer.ts
import { ActionTypes, SET_THEME } from './Action';

export interface State {
  theme: string;
}

const initialState: State = {
  theme: '',
};

const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
