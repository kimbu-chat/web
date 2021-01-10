import { combineReducers } from 'redux';

import { getType } from 'typesafe-actions';
import { UpdateStore } from 'store/update-store';
import auth from './auth/reducer';
import chats from './chats/reducer';
import friends from './friends/reducer';
import myProfile from './my-profile/reducer';
import calls from './calls/reducer';
import internet from './internet/reducer';
import settings from './settings/reducer';

const rootReducer = combineReducers({
  auth,
  chats,
  friends,
  myProfile,
  calls,
  internet,
  settings,
});

export type RootState = ReturnType<typeof rootReducer>;

export default (state: any, action: any): ReturnType<typeof rootReducer> => {
  if (action.type === getType(UpdateStore.action)) {
    return UpdateStore.reducer(state, action);
  }

  return rootReducer(state, action);
};
