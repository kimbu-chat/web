import { ChangeLastMessage } from 'app/store/chats/features/change-last-message/change-last-message';
import { Chat } from 'app/store/chats/models';
import { getChatById } from 'app/store/chats/selectors';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { MessagesState } from '../../models';
import { getChatIndex, getLastMessageByChatId, getMessage } from '../../selectors';
import { MessagesDeletedFromEventActionPayload } from './messages-deleted-from-event-action-payload';

export class MessagesDeletedFromEvent {
  static get action() {
    return createAction('MESSAGE_DELETED_FROM_EVENT')<MessagesDeletedFromEventActionPayload>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof MessagesDeletedFromEvent.action>) => {
      const chatIndex = getChatIndex(draft, payload.chatId);

      payload.messageIds.forEach((msgIdToDelete) => {
        if (getMessage(draft.messages[chatIndex].messages, msgIdToDelete)?.isSelected) {
          draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);
        }

        draft.messages[chatIndex].messages = draft.messages[chatIndex].messages.filter(({ id }) => id !== msgIdToDelete);
      });
      return draft;
    });
  }

  static get saga() {
    return function* deleteMessageSuccessSaga(action: ReturnType<typeof MessagesDeletedFromEvent.action>): SagaIterator {
      const chatOfMessage: Chat = yield select(getChatById(action.payload.chatId));

      if (action.payload.messageIds.includes(chatOfMessage.lastMessage?.id!)) {
        const newMessage = yield select(getLastMessageByChatId(action.payload.chatId));
        yield put(ChangeLastMessage.action({ chatId: action.payload.chatId, newMessage }));
      }
    };
  }
}
