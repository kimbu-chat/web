import { IBaseAttachment, IChatsState } from 'app/store/chats/models';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { RootState } from 'app/store/root-reducer';
import { SetStore } from 'app/store/set-store';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getMessagesChatIndex, getMessage } from '../../selectors';
import { IMessageEditedIntegrationEvent } from './message-edited-integration-event';

export class MessageEditedEventHandler {
  static get action() {
    return createAction('MessageEdited')<IMessageEditedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MessageEditedEventHandler.action>): SagaIterator {
      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        const { chatId, messageId, text } = action.payload;

        // messages update

        const attachments: IBaseAttachment[] = JSON.parse(action.payload.attachments);
        const chatMessagesIndex = getMessagesChatIndex(draft.messages, chatId);
        console.log('chatMessagesIndex', chatMessagesIndex);

        if (chatMessagesIndex !== -1) {
          const message = getMessage(draft.messages.messages[chatMessagesIndex].messages, messageId);

          if (message) {
            message.text = text;
            message.attachments = attachments;
            message.isEdited = true;
          }
        }

        // chat from list update

        const chatListIndex: number = getChatListChatIndex(chatId, draft.chats as IChatsState);
        console.log('chatListIndex', chatListIndex);

        if (chatListIndex !== -1) {
          const chat = draft.chats.chats[chatListIndex];

          if (chat.lastMessage && chat.lastMessage.id === messageId) {
            chat.lastMessage.text = text;
            chat.lastMessage.attachments = attachments;
            chat.lastMessage.isEdited = true;
          }
        }

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));
    };
  }
}
