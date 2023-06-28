// store.ts
import { createStore, combineReducers, Store } from 'redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import reducer, { State as AppState } from './Reducer';

export interface RootState {
  app: AppState;
}

const rootReducer = combineReducers<RootState>({
  app: reducer,
});

const store: Store<RootState> = createStore(rootReducer);

export default store;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
