import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IChangeChatMutedStatusActionPayload } from './change-chat-muted-status-action-payload';
import { IChangeChatMutedStatusRequest } from '../../models';
import { ChangeChatMutedStatusSuccess } from './change-chat-muted-status-success';

export class ChangeChatMutedStatus {
  static get action() {
    return createAction('MUTE_CHAT')<IChangeChatMutedStatusActionPayload>();
  }

  static get saga() {
    return function* muteChatSaga(action: ReturnType<typeof ChangeChatMutedStatus.action>) {
      try {
        const { chatId, isMuted } = action.payload;

        const request: IChangeChatMutedStatusRequest = {
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
    return httpRequestFactory<AxiosResponse, IChangeChatMutedStatusRequest>(`${ApiBasePath.MainApi}/api/chats/change-muted-status`, HttpRequestMethod.Put);
  }
}
