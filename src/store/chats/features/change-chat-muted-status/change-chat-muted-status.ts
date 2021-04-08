import { AxiosResponse } from 'axios';
import { call, put, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { HTTPStatusCode } from '@common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyDefferedAction } from '@store/common/actions';

import { MAIN_API } from '@common/paths';
import { getSelectedChatSelector } from '../../selectors';
import { IChangeChatMutedStatusApiRequest } from './api-requests/change-chat-muted-status-api-request';
import { ChangeChatMutedStatusSuccess } from './change-chat-muted-status-success';

export class ChangeChatMutedStatus {
  static get action() {
    return createEmptyDefferedAction('CHANGE_SELECTED_CHAT_MUTE_STATUS');
  }

  static get saga() {
    return function* muteChatSaga(
      action: ReturnType<typeof ChangeChatMutedStatus.action>,
    ): SagaIterator {
      const { id: chatId, isMuted } = yield select(getSelectedChatSelector);

      const request: IChangeChatMutedStatusApiRequest = {
        chatIds: [chatId],
        isMuted: !isMuted,
      };

      const { status } = ChangeChatMutedStatus.httpRequest.call(
        yield call(() => ChangeChatMutedStatus.httpRequest.generator(request)),
      );

      if (status === HTTPStatusCode.OK) {
        action.meta.deferred.resolve();
        yield put(
          ChangeChatMutedStatusSuccess.action({
            chatId,
            isMuted,
          }),
        );
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeChatMutedStatusApiRequest>(
      MAIN_API.CHANGE_CHAT_MUTED_STATUS,
      HttpRequestMethod.Put,
    );
  }
}
