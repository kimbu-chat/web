import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { authenticatedSelector } from '@store/auth/selectors';
import { IMarkMessagesAsReadApiRequest } from '@store/chats/features/mark-messages-as-read/api-requests/mark-messages-as-read-api-request';
import { MarkMessagesAsRead } from '@store/chats/features/mark-messages-as-read/mark-messages-as-read';
import { getSelectedChatIdSelector } from '@store/chats/selectors';
import { getUnreadMessageId, setUnreadMessageId } from '@store/chats/utils/unread-message';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { IMyProfileState } from '@store/my-profile/my-profile-state';
import { resetUnreadNotifications } from '@utils/set-favicon';

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
      const selectedChatId = yield select(getSelectedChatIdSelector);

      if (isAuthenticated) {
        ChangeUserOnlineStatus.httpRequest.call(
          yield call(() => ChangeUserOnlineStatus.httpRequest.generator({ isOnline: payload })),
        );
      }

      if (payload) {
        resetUnreadNotifications();
      }

      const unreadMessageId = getUnreadMessageId();

      if (unreadMessageId) {
        const httpRequestPayload: IMarkMessagesAsReadApiRequest = {
          chatId: selectedChatId,
          lastReadMessageId: unreadMessageId,
        };

        yield call(() => MarkMessagesAsRead.httpRequest.generator(httpRequestPayload));

        setUnreadMessageId(null);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeUserOnlineStatusApiRequest>(
      MAIN_API.CHANGE_ONLINE_STATUS,
      HttpRequestMethod.Post,
    );
  }
}
