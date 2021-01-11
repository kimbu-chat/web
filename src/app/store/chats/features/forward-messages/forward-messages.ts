import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { IMessage } from '../../models/message';
import { getChatMessageByIdSelector, getSelectedChatIdSelector } from '../../selectors';
import { getMyProfileSelector } from '../../../my-profile/selectors';
import { IChatsState } from '../../models';
import { IForwardMessagesActionPayload } from './action-payloads/forward-messages-action-payload';
import { ICreateMessageApiRequest } from '../create-message/api-requests/create-message-api-request';
import { CreateMessage } from '../create-message/create-message';
import { ForwardMessagesSuccess } from './forward-messages-success';

export class ForwardMessages {
  static get action() {
    return createAction('FORWARD_MESSAGES')<IForwardMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.selectedMessageIds = [];
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof ForwardMessages.action>): SagaIterator {
      const { messageIdsToForward, chatIdsToForward } = action.payload;

      const messagesToForward: { messageId: number; serverMessageId: number }[] = [];

      const forwardedChatId = yield select(getSelectedChatIdSelector);
      const userCreator = yield select(getMyProfileSelector);

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
              originalMessageId: originalMessageId || messageId,
              type: 'Forward',
            },
          };

          const { data } = CreateMessage.httpRequest.call(yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)));

          messagesToForward.push({
            messageId,
            serverMessageId: data,
          });
        }
      }

      yield put(ForwardMessagesSuccess.action({ messagesToForward, userCreator, forwardedChatId, chatIdsToForward, creationDateTime: new Date() }));
    };
  }
}
