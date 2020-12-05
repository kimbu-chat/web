import { combineReducers } from 'redux';

import { getType } from 'typesafe-actions';
import auth from './auth/reducer';
import messages from './messages/reducer';
import chats from './chats/reducer';
import friends from './friends/reducer';
import myProfile from './my-profile/reducer';
import calls from './calls/reducer';
import internet from './internet/reducer';
import settings from './settings/reducer';
import { Logout } from './auth/features/logout/logout';

const rootReducer = combineReducers({
  auth,
  chats,
  messages,
  friends,
  myProfile,
  calls,
  internet,
  settings,
});

export type RootState = ReturnType<typeof rootReducer>;

export default (state: any, action: any): ReturnType<typeof rootReducer> => {
  if (action.type === getType(Logout.action)) {
    return {
      ...state,
      auth: {
        ...state.auth,
        isAuthenticated: false,
      },
      chats: {
        ...state.chats,
        chats: [],
        selectedChatId: null,
      },
      messages: {
        ...state.messages,
        messages: [],
      },
      myProfile: {},
    };
  }
  return rootReducer(state, action);
};
