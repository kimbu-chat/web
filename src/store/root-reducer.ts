import { combineReducers } from 'redux';

import auth from './auth/reducer';
import calls from './calls/reducer';
import chats from './chats/reducer';
import friends from './friends/reducer';
import internet from './internet/reducer';
import login from './login/reducer';
import myProfile from './my-profile/reducer';
import settings from './settings/reducer';
import users from './users/reducer';

export type RootReducer =
  | typeof auth
  | typeof chats
  | typeof friends
  | typeof myProfile
  | typeof calls
  | typeof internet
  | typeof settings
  | typeof users
  | typeof login;

const combinedReducer = combineReducers({
  auth,
  chats,
  friends,
  myProfile,
  calls,
  internet,
  settings,
  users,
  login,
});

export default combinedReducer;
