import { RootAction } from 'typesafe-actions';
import { combinedReducer, CombinedReducerState } from './combined-reducer';

type ReducerAction = RootAction;

type RootReducer = CombinedReducerState;

export default (state: CombinedReducerState | undefined, action: ReducerAction): RootReducer =>
  combinedReducer(state, action);
