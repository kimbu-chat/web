import { IChatsState } from 'store/chats/models';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { MessageState } from '../../models';
import { CreateMessageSuccess } from './create-message-success';
import { ICreateMessageActionPayload } from './action-payloads/create-message-action-payload';
import { getChatIndexDraftSelector } from '../../selectors';
import { ICreateMessageApiRequest } from './api-requests/create-message-api-request';

export class CreateMessage {
  static get action() {
    return createAction('CREATE_MESSAGE')<ICreateMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof CreateMessage.action>) => {
      const { message } = payload;

      const chatIndex = getChatIndexDraftSelector(message.chatId, draft);
      const chat = draft.chats[chatIndex];

      if (chat) {
        chat.attachmentsToSend = [];
        chat.lastMessage = { ...message };
        chat.draftMessage = '';

        const chatWithNewMessage = draft.chats[chatIndex];

        if (chatIndex !== 0) {
          draft.chats.splice(chatIndex, 1);

          draft.chats.unshift(chatWithNewMessage);
        }
      }

      if (chat.messages.messages.findIndex(({ id }) => id === message.id) === -1) {
        chat.messages.messages.unshift(message);
      }
      return draft;
    });
  }

  static get saga() {
    return function* createMessage(action: ReturnType<typeof CreateMessage.action>): SagaIterator {
      const { message } = action.payload;
      const { chatId } = message;

      const attachmentsToSend = message.attachments?.map(({ id, type }) => ({ id, type })) || [];

      const messageCreationReq: ICreateMessageApiRequest = {
        text: message.text,
        chatId,
        attachments: attachmentsToSend,
      };

      const { data } = CreateMessage.httpRequest.call(yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)));

      yield put(
        CreateMessageSuccess.action({
          chatId: message.chatId || 0,
          oldMessageId: message.id,
          newMessageId: data,
          messageState: MessageState.SENT,
          attachments: message.attachments,
        }),
      );
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<number>, ICreateMessageApiRequest>(`${process.env.MAIN_API}/api/messages`, HttpRequestMethod.Post);
  }
}
