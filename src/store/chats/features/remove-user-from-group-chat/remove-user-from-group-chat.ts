import { AxiosResponse } from 'axios';
import { IRemoveUserFromGroupChatRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { getSelectedGroupChatIdSelector } from '../../selectors';

export interface IRemoveUserFromGroupChatActionPayload {
  userId: number;
}

export class RemoveUserFromGroupChat {
  static get action() {
    return createDeferredAction<IRemoveUserFromGroupChatActionPayload>(
      'REMOVE_USER_FROM_GROUP_CHAT',
    );
  }

  static get saga() {
    return function* removeUserFromGroupChatSaga(
      action: ReturnType<typeof RemoveUserFromGroupChat.action>,
    ): SagaIterator {
      const chatId = yield select(getSelectedGroupChatIdSelector);

      try {
        yield call(() =>
          RemoveUserFromGroupChat.httpRequest.generator({
            userId: action.payload.userId,
            groupChatId: chatId,
          }),
        );

        action.meta?.deferred?.resolve();
      } catch (e: any) {
        action.meta?.deferred.reject();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IRemoveUserFromGroupChatRequest>(
      MAIN_API.REMOVE_USER_FROM_CHAT,
      HttpRequestMethod.Post,
    );
  }
}
