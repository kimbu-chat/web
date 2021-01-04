import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { getSelectedChatIdSelector } from '../../selectors';
import { IHideChatRequest } from '../../models';
import { ChangeChatVisibilityStateSuccess } from './change-chat-visibility-state-success';

export class ChangeChatVisibilityState {
  static get action() {
    return createEmptyAction('CHANGE_SELECTED_CHAT_VISIBILITY_STATE');
  }

  static get saga() {
    return function* (): SagaIterator {
      const { chatId } = yield select(getSelectedChatIdSelector);

      try {
        const request: IHideChatRequest = {
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
    return httpRequestFactory<AxiosResponse, IHideChatRequest>(`${process.env.MAIN_API}/api/chats/change-hidden-status`, HttpRequestMethod.Put);
  }
}
