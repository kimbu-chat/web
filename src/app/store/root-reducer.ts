import { combineReducers } from 'redux';
import { AuthActionTypes } from './auth/types';
import produce from 'immer';

import auth from './auth/reducer';
import messages from './messages/reducer';
import dialogs from './dialogs/reducer';
import friends from './friends/reducer';

const rootReducer = combineReducers({
  auth,
  dialogs,
  messages,
  friends
});

export default produce((state: any, action: any) => {
  if (action.type === AuthActionTypes.LOGOUT) {
    state.auth.isAuthenticated = false;
    state = undefined;
    return state;
  }
  return rootReducer(state, action);
});
