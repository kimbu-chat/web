import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatIndex, getLastMessageByChatId, getMessage } from 'app/store/messages/selectors';
import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { ChangeLastMessage } from 'app/store/chats/features/change-last-message/change-last-message';
import { getChatById } from 'app/store/chats/selectors';
import { Chat } from 'app/store/chats/models';
import { DeleteMessageReq, MessagesState } from '../../models';

export class DeleteMessageSuccess {
  static get action() {
    return createAction('DELETE_MESSAGE_SUCCESS')<DeleteMessageReq>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof DeleteMessageSuccess.action>) => {
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
    return function* deleteMessageSuccessSaga(action: ReturnType<typeof DeleteMessageSuccess.action>): SagaIterator {
      const chatOfMessage: Chat = yield select(getChatById(action.payload.chatId));

      if (action.payload.messageIds.includes(chatOfMessage.lastMessage?.id!)) {
        const newMessage = yield select(getLastMessageByChatId(action.payload.chatId));
        yield put(ChangeLastMessage.action({ chatId: action.payload.chatId, newMessage }));
      }
    };
  }
}
