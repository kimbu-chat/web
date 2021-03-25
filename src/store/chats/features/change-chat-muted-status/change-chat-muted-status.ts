import { AxiosResponse } from 'axios';
import { call, put, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyAction } from '@store/common/actions';
import { getSelectedChatSelector } from '../../selectors';
import { IChangeChatMutedStatusApiRequest } from './api-requests/change-chat-muted-status-api-request';
import { ChangeChatMutedStatusSuccess } from './change-chat-muted-status-success';

export class ChangeChatMutedStatus {
  static get action() {
    return createEmptyAction('CHANGE_SELECTED_CHAT_MUTE_STATUS');
  }

  static get saga() {
    return function* muteChatSaga(): SagaIterator {
      const { id: chatId, isMuted } = yield select(getSelectedChatSelector);

      const request: IChangeChatMutedStatusApiRequest = {
        chatIds: [chatId],
        isMuted: !isMuted,
      };

      const { status } = ChangeChatMutedStatus.httpRequest.call(yield call(() => ChangeChatMutedStatus.httpRequest.generator(request)));

      if (status === 200) {
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
    return httpRequestFactory<AxiosResponse, IChangeChatMutedStatusApiRequest>(`${process.env.MAIN_API}/api/chats/change-muted-status`, HttpRequestMethod.Put);
  }
}
