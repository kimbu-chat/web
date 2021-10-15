import { AxiosResponse, CancelTokenSource } from 'axios';
import produce from 'immer';
import { ICreateMessageRequest, ICreateMessageResponse } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { MessageState } from '@store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { addMessageSendingRequest } from '@utils/cancel-send-message-request';

import { IChatsState } from '../../chats-state';

import { ICreateMessageActionPayload } from './action-payloads/create-message-action-payload';
import { CreateMessageSuccess } from './create-message-success';

export class CreateMessage {
  static get action() {
    return createAction('CREATE_MESSAGE')<ICreateMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof CreateMessage.action>) => {
      const { message } = payload;

      const chat = draft.chats[message.chatId];

      if (chat) {
        delete chat.attachmentsToSend;
        chat.lastMessage = message;
        chat.draftMessage = '';
        delete chat.messageToReply;

        const chatIndex = draft.chatList.chatIds.indexOf(chat.id);
        if (chatIndex !== 0) {
          draft.chatList.chatIds.splice(chatIndex, 1);

          draft.chatList.chatIds.unshift(chat.id);
        }
      }

      const chatMessages = draft.chats[message.chatId]?.messages;

      if (chatMessages && !chatMessages.messages[message.id]) {
        chatMessages.messages[message.id] = message;
        chatMessages.messageIds.unshift(message.id);
      }
      return draft;
    });
  }

  static get saga() {
    return function* createMessage(action: ReturnType<typeof CreateMessage.action>): SagaIterator {
      const { message } = action.payload;
      const { chatId } = message;

      const messageCreationReq: ICreateMessageRequest = {
        text: message.text,
        chatId,
        attachmentIds: message.attachments?.map((x) => x.id),
        clientId: message.id,
      };

      if (message.linkedMessage && message.linkedMessageType) {
        messageCreationReq.link = {
          type: message.linkedMessageType,
          originalMessageId: message.linkedMessage.id,
        };
      }

      const response = CreateMessage.httpRequest.call(
        yield call(() =>
          CreateMessage.httpRequest.generator(
            messageCreationReq,
            (cancelToken: CancelTokenSource) =>
              addMessageSendingRequest(action.payload.message.id, cancelToken),
          ),
        ),
      );

      // if request was canceled, response is undefined and we shouldn't submit CreateMessageSuccess
      if (!response) {
        return;
      }

      yield put(
        CreateMessageSuccess.action({
          chatId,
          oldMessageId: message.id,
          newMessageId: response.data.id,
          messageState: MessageState.SENT,
          attachments: message.attachments,
        }),
      );
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICreateMessageResponse>, ICreateMessageRequest>(
      MAIN_API.MESSAGES,
      HttpRequestMethod.Post,
    );
  }
}
