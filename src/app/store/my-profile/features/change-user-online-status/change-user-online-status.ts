import { amIAuthenticatedSelector } from 'app/store/auth/selectors';
import { resetUnreadNotifications } from 'app/store/chats/socket-events/message-created/message-created-event-handler';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IMyProfileState } from '../../models';
import { IChangeUserOnlineStatusApiRequest } from './api-requests/change-user-online-status-api-request';

export class ChangeUserOnlineStatus {
  static get action() {
    return createAction('CHANGE_ONLINE_STATUS')<boolean>();
  }

  static get reducer() {
    return produce((draft: IMyProfileState, { payload }: ReturnType<typeof ChangeUserOnlineStatus.action>) => {
      draft.isTabActive = payload;
      return draft;
    });
  }

  static get saga() {
    return function* ({ payload }: ReturnType<typeof ChangeUserOnlineStatus.action>): SagaIterator {
      const isAuthenticated = yield select(amIAuthenticatedSelector);
      if (isAuthenticated) {
        ChangeUserOnlineStatus.httpRequest.call(yield call(() => ChangeUserOnlineStatus.httpRequest.generator({ isOnline: payload })));
      }

      if (payload) {
        resetUnreadNotifications();

        window.document.title = 'Kimbu';
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeUserOnlineStatusApiRequest>(
      `${process.env.MAIN_API}/api/users/change-online-status`,
      HttpRequestMethod.Post,
    );
  }
}
