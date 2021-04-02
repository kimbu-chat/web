import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { authenticatedSelector } from '@store/auth/selectors';
import { resetUnreadNotifications } from '@utils/set-favicon';
import { IMyProfileState } from '@store/my-profile/my-profile-state';

import { IChangeUserOnlineStatusApiRequest } from './api-requests/change-user-online-status-api-request';

export class ChangeUserOnlineStatus {
  static get action() {
    return createAction('CHANGE_ONLINE_STATUS')<boolean>();
  }

  static get reducer() {
    return produce(
      (draft: IMyProfileState, { payload }: ReturnType<typeof ChangeUserOnlineStatus.action>) => {
        draft.isTabActive = payload;
        return draft;
      },
    );
  }

  static get saga() {
    return function* changeUserOnlineStatus({
      payload,
    }: ReturnType<typeof ChangeUserOnlineStatus.action>): SagaIterator {
      const isAuthenticated = yield select(authenticatedSelector);
      if (isAuthenticated) {
        ChangeUserOnlineStatus.httpRequest.call(
          yield call(() => ChangeUserOnlineStatus.httpRequest.generator({ isOnline: payload })),
        );
      }

      if (payload) {
        resetUnreadNotifications();

        window.document.title = 'Ravudi';
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeUserOnlineStatusApiRequest>(
      `${window.__config.REACT_APP_MAIN_API}/api/users/change-online-status`,
      HttpRequestMethod.Post,
    );
  }
}
