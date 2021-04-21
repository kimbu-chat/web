import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { MAIN_API } from '@common/paths';
import { MessageState } from '../../models';
import { CreateMessageSuccess } from './create-message-success';
import { ICreateMessageActionPayload } from './action-payloads/create-message-action-payload';
import { getChatIndexDraftSelector } from '../../selectors';
import { ICreateMessageApiRequest } from './api-requests/create-message-api-request';
import { IChatsState } from '../../chats-state';

export class CreateMessage {
  static get action() {
    return createAction('CREATE_MESSAGE')<ICreateMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof CreateMessage.action>) => {
      const { message } = payload;

      const chatIndex = getChatIndexDraftSelector(message.chatId, draft);
      const chat = draft.chats.chats[chatIndex];

      if (chat) {
        delete chat.attachmentsToSend;
        chat.lastMessage = { ...message };
        chat.draftMessage = '';
        delete chat.messageToReply;

        const chatWithNewMessage = draft.chats.chats[chatIndex];

        if (chatIndex !== 0) {
          draft.chats.chats.splice(chatIndex, 1);

          draft.chats.chats.unshift(chatWithNewMessage);
        }
      }

      if (draft.messages[chat.id].messages.findIndex(({ id }) => id === message.id) === -1) {
        draft.messages[chat.id].messages.unshift(message);
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
        clientId: message.id,
      };

      if (message.linkedMessage && message.linkedMessageType) {
        messageCreationReq.link = {
          type: message.linkedMessageType,
          originalMessageId: message.linkedMessage.id,
        };
      }

      const { data } = CreateMessage.httpRequest.call(
        yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)),
      );

      yield put(
        CreateMessageSuccess.action({
          chatId,
          oldMessageId: message.id,
          newMessageId: data,
          messageState: MessageState.SENT,
          attachments: message.attachments,
        }),
      );
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<number>, ICreateMessageApiRequest>(
      MAIN_API.MESSAGES,
      HttpRequestMethod.Post,
    );
  }
}
