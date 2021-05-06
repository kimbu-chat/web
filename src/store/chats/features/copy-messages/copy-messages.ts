import { getUsersSelector } from '@store/users/selectors';
import moment from 'moment';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { INormalizedMessage } from '../../models';
import { getSelectedChatMessagesSelector } from '../../selectors';
import { ICopyMessagesActionPayload } from './action-payloads/copy-messages-action-payload';

export class CopyMessages {
  static get action() {
    return createAction('COPY_MESSAGES')<ICopyMessagesActionPayload>();
  }

  static get saga() {
    return function* copyMessages(action: ReturnType<typeof CopyMessages.action>): SagaIterator {
      const messages: INormalizedMessage[] = yield select(getSelectedChatMessagesSelector);
      const users = yield select(getUsersSelector);

      const content = action.payload.messageIds.reduce((accum: string, currentMessageId, index) => {
        const message = messages[currentMessageId];
        if (message) {
          const userCreator = users[message.userCreatorId];
          const preparedStr = `[${moment
            .utc(message?.creationDateTime)
            .format('YYYY MM DD h:mm')}] ${userCreator?.nickname}: ${message?.text}${
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
