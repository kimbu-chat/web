import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { HTTPStatusCode } from '@common/http-status-code';
import { Meta } from '@store/common/actions';
import { INormalizedMessage } from '../../models/message';
import { getMessageSelector, getSelectedChatIdSelector } from '../../selectors';
import { MessageLinkType } from '../../models';
import { IForwardMessagesActionPayload } from './action-payloads/forward-messages-action-payload';
import { ICreateMessageApiRequest } from '../create-message/api-requests/create-message-api-request';
import { CreateMessage } from '../create-message/create-message';
import { IChatsState } from '../../chats-state';

export class ForwardMessages {
  static get action() {
    return createAction('FORWARD_MESSAGES')<IForwardMessagesActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.selectedMessageIds = [];

      return draft;
    });
  }

  static get saga() {
    return function* forwardSaga(action: ReturnType<typeof ForwardMessages.action>): SagaIterator {
      const { messageIdsToForward, chatIdsToForward } = action.payload;

      const forwardedChatId = yield select(getSelectedChatIdSelector);

      // eslint-disable-next-line no-restricted-syntax
      for (const messageId of messageIdsToForward) {
        const message: INormalizedMessage = yield select(
          getMessageSelector(forwardedChatId, messageId),
        );
        const originalMessageId = message.linkedMessage?.id;
        // eslint-disable-next-line no-restricted-syntax
        for (const chatId of chatIdsToForward) {
          const messageCreationReq: ICreateMessageApiRequest = {
            text: '',
            chatId,
            link: {
              originalMessageId:
                message.linkedMessageType === MessageLinkType.Forward
                  ? (originalMessageId as number)
                  : messageId,
              type: 'Forward',
            },
          };

          const { status } = CreateMessage.httpRequest.call(
            yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)),
          );

          if (status === HTTPStatusCode.OK) {
            action.meta.deferred?.resolve();
          }
        }
      }
    };
  }
}
