import { combineReducers } from 'redux';

import auth from './auth/reducer';
import chats from './chats/reducer';
import friends from './friends/reducer';
import myProfile from './my-profile/reducer';
import calls from './calls/reducer';
import internet from './internet/reducer';
import settings from './settings/reducer';

export const combinedReducer = combineReducers({
  auth,
  chats,
  friends,
  myProfile,
  calls,
  internet,
  settings,
});

export type CombinedReducerState = ReturnType<typeof combinedReducer>;
