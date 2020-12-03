import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { Chat, MuteChatRequest } from '../models';
import { MuteChatSuccess } from './mute-chat-success';

export class MuteChat {
  static get action() {
    return createAction('MUTE_CHAT')<Chat>();
  }

  static get saga() {
    return function* muteChatSaga(action: ReturnType<typeof MuteChat.action>) {
      try {
        const chat: Chat = action.payload;

        const request: MuteChatRequest = {
          chatIds: [chat.id],
          isMuted: !chat.isMuted,
        };

        const { status } = MuteChat.httpRequest.call(yield call(() => MuteChat.httpRequest.generator(request)));

        if (status === 200) {
          yield put(MuteChatSuccess.action(chat));
        } else {
          alert('Error mute chat');
        }
      } catch (e) {
        console.warn(e);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, MuteChatRequest>(`${ApiBasePath.MainApi}/api/chats/change-muted-status`, HttpRequestMethod.Put);
  }
}
