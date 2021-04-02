import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector } from '../../selectors';
import { IDeleteMessageActionPayload } from './action-payloads/delete-message-action-payload';
import { DeleteMessageSuccess } from './delete-message-success';
import { IDeleteMessagesApiRequest } from './api-requests/delete-message-api-request';
import { IChatsState } from '../../chats-state';

export class DeleteMessage {
  static get action() {
    return createAction('DELETE_MESSAGE')<IDeleteMessageActionPayload>();
  }

  // TODO: handle loading
  static get reducer() {
    return produce((draft: IChatsState) => draft);
  }

  static get saga() {
    return function* deleteMessageSaga(
      action: ReturnType<typeof DeleteMessage.action>,
    ): SagaIterator {
      const { messageIds, forEveryone } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const { status } = DeleteMessage.httpRequest.call(
        yield call(() => DeleteMessage.httpRequest.generator({ ids: messageIds, forEveryone })),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(DeleteMessageSuccess.action({ messageIds, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDeleteMessagesApiRequest>(
      `${window.__config.REACT_APP_MAIN_API}/api/messages/delete-message-list`,
      HttpRequestMethod.Post,
    );
  }
}
