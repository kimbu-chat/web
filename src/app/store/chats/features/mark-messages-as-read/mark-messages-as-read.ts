import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from '../../chats-utils';
import { ChatsState, MarkMessagesAsReadRequest } from '../../models';
import { MarkMessagesAsReadActionPayload } from './mark-messages-as-read-action-payload';

export class MarkMessagesAsRead {
  static get action() {
    return createAction('RESET_UNREAD_MESSAGES_COUNT')<MarkMessagesAsReadActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof MarkMessagesAsRead.action>) => {
      const { chatId } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);
      draft.chats[chatIndex].ownUnreadMessagesCount = 0;
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof MarkMessagesAsRead.action>): SagaIterator {
      MarkMessagesAsRead.httpRequest.call(yield call(() => MarkMessagesAsRead.httpRequest.generator(action.payload)));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, MarkMessagesAsReadRequest>(`${ApiBasePath.MainApi}/api/chats/mark-as-read`, HttpRequestMethod.Post);
  }
}
