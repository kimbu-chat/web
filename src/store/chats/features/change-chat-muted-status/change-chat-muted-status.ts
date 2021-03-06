import { AxiosResponse } from 'axios';
import { IChangeChatsMuteStatusRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { getChatByIdSelector } from '../../selectors';

import { ChangeChatMutedStatusSuccess } from './change-chat-muted-status-success';

export interface IChangeChatMutedStatusActionPayload {
  chatId: number;
  isMuted: boolean;
}

export class ChangeChatMutedStatus {
  static get action() {
    return createDeferredAction<number>('CHANGE_SELECTED_CHAT_MUTE_STATUS');
  }

  static get saga() {
    return function* muteChatSaga(
      action: ReturnType<typeof ChangeChatMutedStatus.action>,
    ): SagaIterator {
      const chatId = action.payload;
      const { isMuted } = yield select(getChatByIdSelector(chatId));

      const request: IChangeChatsMuteStatusRequest = {
        chatIds: [chatId],
        isMuted: !isMuted,
      };

      const { status } = ChangeChatMutedStatus.httpRequest.call(
        yield call(() => ChangeChatMutedStatus.httpRequest.generator(request)),
      );

      if (status === HTTPStatusCode.OK) {
        action.meta?.deferred?.resolve();
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
    return httpRequestFactory<AxiosResponse, IChangeChatsMuteStatusRequest>(
      MAIN_API.CHANGE_CHAT_MUTED_STATUS,
      HttpRequestMethod.Put,
    );
  }
}
