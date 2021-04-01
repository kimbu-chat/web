import { getType, RootAction } from 'typesafe-actions';
import { UpdateStore } from './update-store';
import { combinedReducer, CombinedReducerState } from './combined-reducer';

type ReducerAction = RootAction | ReturnType<typeof UpdateStore.action>;

type RootReducer = CombinedReducerState | ReturnType<typeof UpdateStore.reducer>;

const mainReducer = (
  state: CombinedReducerState | undefined,
  action: ReducerAction,
): RootReducer => {
  if (action.type === getType(UpdateStore.action)) {
    return UpdateStore.reducer(state, action);
  }

  return combinedReducer(state, action);
};

export default mainReducer;
