import { combineReducers } from 'redux';
import { AuthActionTypes } from './auth/types';

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

export default (state: any, action: any) => {
  if (action.type === AuthActionTypes.LOGOUT) {
    state = undefined;
  }
  return rootReducer(state, action);
};
