import dayjs from 'dayjs';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { YEAR_MONTH_DAY_HOUR_MINUTE } from '@common/constants';
import { INormalizedMessage } from '@store/chats/models';
import { getUsersSelector } from '@store/users/selectors';

import { getSelectedChatMessagesSelector } from '../../selectors';

import { ICopyMessagesActionPayload } from './action-payloads/copy-messages-action-payload';

export class CopyMessages {
  static get action() {
    return createAction('COPY_MESSAGES')<ICopyMessagesActionPayload>();
  }

  static get saga() {
    return function* copyMessages(action: ReturnType<typeof CopyMessages.action>): SagaIterator {
      const messages: Record<number, INormalizedMessage> = yield select(
        getSelectedChatMessagesSelector,
      );
      const users = yield select(getUsersSelector);

      const content = action.payload.messageIds.reduce((accum: string, currentMessageId, index) => {
        const message = messages[currentMessageId];
        if (message) {
          const userCreator = users[message.userCreatorId];
          const preparedStr = `[${dayjs
            .utc(message?.creationDateTime)
            .format(YEAR_MONTH_DAY_HOUR_MINUTE)}] ${userCreator?.nickname}: ${message?.text}${
            index < action.payload.messageIds.length - 1 ? '\n' : ''
          }`;
          return accum + preparedStr;
        }
        return accum;
      }, '');

      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    };
  }
}
