import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IChat, IHideChatRequest } from '../../models';
import { IChangeChatVisibilityStateActionPayload } from './change-chat-visibility-state-action-payload';
import { ChangeChatVisibilityStateSuccess } from './change-chat-visibility-state-success';

export class ChangeChatVisibilityState {
  static get action() {
    return createAction('CHANGE_CHAT_VISIBILITY_STATE')<IChangeChatVisibilityStateActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof ChangeChatVisibilityState.action>): SagaIterator {
      const chat: IChat = action.payload;

      try {
        const request: IHideChatRequest = {
          chatIds: [chat.id],
          isHidden: true,
        };

        const response = ChangeChatVisibilityState.httpRequest.call(yield call(() => ChangeChatVisibilityState.httpRequest.generator(request)));

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
    return httpRequestFactory<AxiosResponse, IHideChatRequest>(`${ApiBasePath.MainApi}/api/chats/change-hidden-status`, HttpRequestMethod.Put);
  }
}
