import { ICreateMessageRequest, MessageLinkType } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';

import { HTTPStatusCode } from '@common/http-status-code';
import { createDeferredAction } from '@store/common/actions';

import { IChatsState } from '../../chats-state';
import { INormalizedMessage } from '../../models/normalized-message';
import { getMessageSelector, getSelectedChatIdSelector } from '../../selectors';
import { CreateMessage } from '../create-message/create-message';

export interface IForwardMessagesActionPayload {
  messageIdsToForward: number[];
  chatIdsToForward: number[];
}

export class ForwardMessages {
  static get action() {
    return createDeferredAction<IForwardMessagesActionPayload>('FORWARD_MESSAGES');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      draft.selectedMessageIds = [];

      return draft;
    };
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
          const messageCreationReq: ICreateMessageRequest = {
            chatId,
            link: {
              originalMessageId:
                message.linkedMessageType === MessageLinkType.Forward
                  ? (originalMessageId as number)
                  : messageId,
              type: MessageLinkType.Forward,
            },
            // Property clientId has no meaning here because messages are not added in forward-messages reduce
            clientId: 0,
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
