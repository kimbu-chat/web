import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { call, put, select } from 'redux-saga/effects';
import { getSelectedChatSelector } from '../../selectors';
import { IChangeChatMutedStatusApiRequest } from './api-requests/change-chat-muted-status-api-request';
import { ChangeChatMutedStatusSuccess } from './change-chat-muted-status-success';

export class ChangeChatMutedStatus {
  static get action() {
    return createEmptyAction('MUTE_SELECTED_CHAT');
  }

  static get saga() {
    return function* muteChatSaga() {
      try {
        const { id: chatId, isMuted } = yield select(getSelectedChatSelector);

        const request: IChangeChatMutedStatusApiRequest = {
          chatIds: [chatId],
          isMuted,
        };

        const { status } = ChangeChatMutedStatus.httpRequest.call(yield call(() => ChangeChatMutedStatus.httpRequest.generator(request)));

        if (status === 200) {
          yield put(
            ChangeChatMutedStatusSuccess.action({
              chatId,
              isMuted,
            }),
          );
        } else {
          alert('Error mute chat');
        }
      } catch (e) {
        console.warn(e);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeChatMutedStatusApiRequest>(`${process.env.MAIN_API}/api/chats/change-muted-status`, HttpRequestMethod.Put);
  }
}
