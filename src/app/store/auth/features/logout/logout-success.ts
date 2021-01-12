import { createEmptyAction } from 'store/common/actions';
import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { RootState } from 'app/store/root-reducer';
import { UpdateStore } from 'app/store/update-store';
import { getWebsocketStateSelector } from 'app/store/internet/selectors';

export class LogoutSuccess {
  static get action() {
    return createEmptyAction('LOGOUT_SUCCESS');
  }

  static get saga() {
    return function* (): SagaIterator {
      const settings = yield select((state: RootState) => state.settings);
      const websocketState = yield select(getWebsocketStateSelector);

      yield put(
        UpdateStore.action({
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
            amICalling: false,
            interlocutor: undefined,
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
            selectedChatId: null,
            selectedMessageIds: [],
          },
          friends: {
            loading: true,
            friends: [],
            hasMoreFriends: true,
          },
          internet: {
            isInternetConnected: true,
            isWebSocketConnected: websocketState,
          },
          myProfile: {
            user: undefined,
            isTabActive: true,
          },
          settings,
        }),
      );
    };
  }
}
