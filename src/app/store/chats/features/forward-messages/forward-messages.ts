import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { IMessage } from '../../models/message';
import { getChatMessageByIdSelector, getSelectedChatIdSelector } from '../../selectors';
import { IChatsState, MessageLinkType } from '../../models';
import { IForwardMessagesActionPayload } from './action-payloads/forward-messages-action-payload';
import { ICreateMessageApiRequest } from '../create-message/api-requests/create-message-api-request';
import { CreateMessage } from '../create-message/create-message';

export class ForwardMessages {
  static get action() {
    return createAction('FORWARD_MESSAGES')<IForwardMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        draft.messages[draft.selectedChatId].messages.forEach((message) => {
          message.isSelected = false;
        });
      }

      draft.selectedMessageIds = [];

      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof ForwardMessages.action>): SagaIterator {
      const { messageIdsToForward, chatIdsToForward } = action.payload;

      const messagesToForward: { messageId: number; serverMessageId: number; chatId: number }[] = [];

      const forwardedChatId = yield select(getSelectedChatIdSelector);

      // eslint-disable-next-line no-restricted-syntax
      for (const messageId of messageIdsToForward) {
        const message: IMessage = yield select(getChatMessageByIdSelector(messageId, forwardedChatId));
        const originalMessageId = message.linkedMessage?.id;
        // eslint-disable-next-line no-restricted-syntax
        for (const chatId of chatIdsToForward) {
          const messageCreationReq: ICreateMessageApiRequest = {
            text: '',
            chatId,
            link: {
              originalMessageId: message.linkedMessageType === MessageLinkType.Forward ? originalMessageId! : messageId,
              type: 'Forward',
            },
          };

          const { data } = CreateMessage.httpRequest.call(yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)));

          messagesToForward.push({
            messageId,
            serverMessageId: data,
            chatId,
          });
        }
      }
    };
  }
}
