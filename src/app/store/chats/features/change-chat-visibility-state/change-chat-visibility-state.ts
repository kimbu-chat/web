import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { IChangeChatVisibilityStateApiRequest } from './api-requests/change-chat-visibility-state-api-request';
import { getSelectedChatIdSelector } from '../../selectors';
import { ChangeChatVisibilityStateSuccess } from './change-chat-visibility-state-success';

export class ChangeChatVisibilityState {
  static get action() {
    return createEmptyAction('CHANGE_SELECTED_CHAT_VISIBILITY_STATE');
  }

  static get saga() {
    return function* (): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);

      console.log('CHANGE_SELECTED_CHAT_VISIBILITY_STATE', chatId);

      try {
        const request: IChangeChatVisibilityStateApiRequest = {
          chatIds: [chatId],
          isHidden: true,
        };

        const response = ChangeChatVisibilityState.httpRequest.call(yield call(() => ChangeChatVisibilityState.httpRequest.generator(request)));

        if (response.status === 200) {
          yield put(ChangeChatVisibilityStateSuccess.action({ chatId }));
        } else {
          alert('Error chat deletion');
        }
      } catch (e) {
        console.warn(e);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IChangeChatVisibilityStateApiRequest>(
      `${process.env.MAIN_API}/api/chats/change-hidden-status`,
      HttpRequestMethod.Put,
    );
  }
}
