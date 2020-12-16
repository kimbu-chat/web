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
import { LogoutSuccess } from './auth/features/logout/logout-success';

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
  if (action.type === getType(LogoutSuccess.action)) {
    const initialRootState: RootState = {
      auth: {
        loading: false,
        confirmationCode: '',
        twoLetterCountryCode: '',
        phoneNumber: '',
        isConfirmationCodeWrong: false,
        isAuthenticated: false,
        securityTokens: {
          accessToken: '',
          refreshToken: '',
          refreshTokenExpirationTime: undefined,
          refreshTokenRequestLoading: false,
          isAuthenticated: false,
        },
      },
      calls: {
        isInterlocutorVideoEnabled: false,
        amICalled: false,
        isInterlocutorBusy: false,
        isScreenSharingOpened: false,
        isSpeaking: false,
        videoConstraints: {
          isOpened: false,
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 480, ideal: 1440, max: 1440 },
        },
        audioConstraints: { isOpened: true },
        amICaling: false,
        interlocutor: undefined,
        offer: undefined,
        audioDevicesList: [],
        videoDevicesList: [],
        calls: {
          calls: [],
          loading: false,
          hasMore: true,
        },
      },
      chats: {
        loading: false,
        hasMore: true,
        searchString: '',
        chats: [],
      },
      friends: {
        loading: true,
        friends: [],
        hasMoreFriends: true,
      },
      internet: {
        isInternetConnected: typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
      },
      messages: {
        loading: false,
        messages: [],
        selectedMessageIds: [],
      },
      myProfile: {
        user: undefined,
      },
      settings: state.settings,
    };

    return initialRootState;
  }
  return rootReducer(state, action);
};
