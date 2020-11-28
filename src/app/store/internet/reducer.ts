import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { InternetActions } from './actions';

export interface InternetState {
  isInternetConnected: boolean;
}

const initialState: InternetState = {
  isInternetConnected: typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
};

const internet = createReducer<InternetState>(initialState).handleAction(
  InternetActions.internetConnectionCheck,
  produce((draft: InternetState, { payload }: ReturnType<typeof InternetActions.internetConnectionCheck>) => {
    draft.isInternetConnected = payload.state;
    return draft;
  }),
);

export default internet;
