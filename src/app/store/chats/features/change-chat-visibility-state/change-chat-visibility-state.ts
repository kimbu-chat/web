import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Chat, HideChatRequest } from '../../models';
import { ChangeChatVisibilityStateSuccess } from './change-chat-visibility-state-success';

export class ChangeChatVisibilityState {
  static get action() {
    return createAction('CHANGE_CHAT_VISIBILITY_STATE')<Chat>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChangeChatVisibilityState.action>): SagaIterator {
      const chat: Chat = action.payload;
      let response: AxiosResponse;

      try {
        const request: HideChatRequest = {
          chatIds: [chat.id],
          isHidden: true,
        };

        response = ChangeChatVisibilityState.httpRequest.call(yield call(() => ChangeChatVisibilityState.httpRequest.generator(request)));

        if (response.status === 200) {
          yield put(ChangeChatVisibilityStateSuccess.action(chat));
        } else {
          alert('Error chat deletion');
        }
      } catch (e) {
        console.warn(e);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, HideChatRequest>(`${ApiBasePath.MainApi}/api/chats/change-hidden-status`, HttpRequestMethod.Put);
  }
}