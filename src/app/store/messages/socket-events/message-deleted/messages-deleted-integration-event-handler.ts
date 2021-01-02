import { RootState } from 'store/root-reducer';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ChangeLastMessage } from 'app/store/chats/features/change-last-message/change-last-message';
import { IChat } from 'app/store/chats/models';
import { getChatById } from 'app/store/chats/selectors';
import { SetStore } from 'app/store/set-store';
import { IMessagesDeletedIntegrationEvent } from './messages-deleted-integration-event';
import { getMessagesChatIndex, getMessage, getLastMessageByChatId } from '../../selectors';

export class MessagesDeletedIntegrationEventHandler {
  static get action() {
    return createAction('MessagesDeleted')<IMessagesDeletedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MessagesDeletedIntegrationEventHandler.action>): SagaIterator {
      const state: RootState = yield select();
      const nextState = produce(state, (draft) => {
        // messages list update
        const chatIndex = getMessagesChatIndex(draft.messages, action.payload.chatId);

        action.payload.messageIds.forEach((msgIdToDelete) => {
          if (getMessage(draft.messages.messages[chatIndex].messages, msgIdToDelete)?.isSelected) {
            draft.messages.selectedMessageIds = draft.messages.selectedMessageIds.filter((id) => id !== msgIdToDelete);
          }

          draft.messages.messages[chatIndex].messages = draft.messages.messages[chatIndex].messages.filter(({ id }) => id !== msgIdToDelete);
        });
        return draft;
      });

      yield put(SetStore.action(nextState as RootState));

      const chatOfMessage: IChat = yield select(getChatById(action.payload.chatId));

      if (action.payload.messageIds.includes(chatOfMessage.lastMessage?.id!)) {
        const newMessage = yield select(getLastMessageByChatId(action.payload.chatId));
        yield put(ChangeLastMessage.action({ chatId: action.payload.chatId, newMessage }));
      }
    };
  }
}
