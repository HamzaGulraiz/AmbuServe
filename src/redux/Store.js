import {createStore, combineReducers, Store} from 'redux';
import {useSelector, TypedUseSelectorHook} from 'react-redux';
import reducer, {State as AppState} from './Reducer';

// export interface RootState {
//   reducer: AppState;
// }

const rootReducer = combineReducers({
  reducer: reducer,
});

const store = createStore(rootReducer);

export default store;

export const useTypedSelector = useSelector;
