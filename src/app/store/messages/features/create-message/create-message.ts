import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { getMessagesChatIndex } from 'app/store/messages/selectors';
import { IMessageCreationReqData, IMessageList, IMessagesState, MessageState } from '../../models';
import { CreateMessageSuccess } from './create-message-success';
import { ICreateMessageActionPayload } from './create-message-action-payload';

export class CreateMessage {
  static get action() {
    return createAction('CREATE_MESSAGE')<ICreateMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof CreateMessage.action>) => {
      const { message } = payload;
      const { chatId } = message;

      const chatIndex = getMessagesChatIndex(draft, chatId);

      if (chatIndex === -1) {
        const messageList: IMessageList = {
          chatId,
          messages: [message],
          hasMoreMessages: false,
        };
        draft.messages.unshift(messageList);

        return draft;
      }

      if (draft.messages[chatIndex].messages.findIndex(({ id }) => id === message.id) === -1) {
        draft.messages[chatIndex].messages.unshift(message);
      }
      return draft;
    });
  }

  static get saga() {
    return function* createMessage(action: ReturnType<typeof CreateMessage.action>): SagaIterator {
      const { message } = action.payload;
      const { chatId } = message;

      const attachmentsToSend = message.attachments?.map(({ id, type }) => ({ id, type })) || [];
      try {
        const messageCreationReq: IMessageCreationReqData = {
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
      } catch {
        alert('error message create');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<number>, IMessageCreationReqData>(`${process.env.MAIN_API}/api/messages`, HttpRequestMethod.Post);
  }
}
