import moment from 'moment';
import { SagaIterator } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IMessageList } from '../../models';
import { getMessagesByChatId } from '../../selectors';
import { ICopyMessagesActionPayload } from './copy-messages-action-payload';

export class CopyMessages {
  static get action() {
    return createAction('COPY_MESSAGES')<ICopyMessagesActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CopyMessages.action>): SagaIterator {
      const chat: IMessageList = yield select(getMessagesByChatId(action.payload.chatId));

      const content = chat.messages.reduce((accum: string, current) => {
        if (action.payload.messageIds.includes(current.id)) {
          const preparedStr = `\n[${moment.utc(current?.creationDateTime).format('YYYY MM DD h:mm')}] ${current?.userCreator?.nickname}: ${current?.text}`;
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
