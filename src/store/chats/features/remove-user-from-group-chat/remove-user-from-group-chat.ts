import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { Meta } from '@store/common/actions';
import { MAIN_API } from '@common/paths';

import { getSelectedGroupChatIdSelector } from '../../selectors';

import { IRemoveUserFromGroupChatActionPayload } from './action-payloads/remove-user-from-group-chat-payload';
import { IRemoveUserFromGroupChatApiRequest } from './api-requests/remove-user-from-group-chat-api-request';
import { RemoveUserFromGroupChatSuccess } from './remove-user-from-group-chat-success';

export class RemoveUserFromGroupChat {
  static get action() {
    return createAction('REMOVE_USER_FROM_GROUP_CHAT')<
      IRemoveUserFromGroupChatActionPayload,
      Meta
    >();
  }

  static get saga() {
    return function* addFriend(
      action: ReturnType<typeof RemoveUserFromGroupChat.action>,
    ): SagaIterator {
      const chatId = yield select(getSelectedGroupChatIdSelector);
      yield call(() =>
        RemoveUserFromGroupChat.httpRequest.generator({
          userId: action.payload.userId,
          groupChatId: chatId,
        }),
      );

      yield put(
        RemoveUserFromGroupChatSuccess.action({
          userId: action.payload.userId,
          groupChatId: chatId,
        }),
      );

      action.meta.deferred?.resolve();
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IRemoveUserFromGroupChatApiRequest>(
      MAIN_API.REMOVE_USER_FROM_CHAT,
      HttpRequestMethod.Post,
    );
  }
}
