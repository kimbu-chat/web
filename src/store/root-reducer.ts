import { RootAction } from 'typesafe-actions';
import { combinedReducer, CombinedReducerState } from './combined-reducer';

type ReducerAction = RootAction;

type RootReducer = CombinedReducerState;

const mainReducer = (state: CombinedReducerState | undefined, action: ReducerAction): RootReducer =>
  combinedReducer(state, action);

export default mainReducer;
