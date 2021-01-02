import { IChatsState } from 'app/store/chats/models';
import { MyProfileService } from 'app/services/my-profile-service';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { RootState } from 'app/store/root-reducer';
import { SetStore } from 'app/store/set-store';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { MessageState } from '../../models';
import { IMessagesReadIntegrationEvent } from './messages-read-integration-event';
import { getMessagesChatIndex } from '../../selectors';

export class MessageReadEventHandler {
  static get action() {
    return createAction('MessagesRead')<IMessagesReadIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MessageReadEventHandler.action>): SagaIterator {
      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        // chat update
        const { lastReadMessageId, chatId } = action.payload;

        const chatListIndex = getChatListChatIndex(chatId, draft.chats as IChatsState);

        if (chatListIndex >= 0) {
          draft.chats.chats[chatListIndex].interlocutorLastReadMessageId = lastReadMessageId;

          if (draft.chats.chats[chatListIndex].lastMessage?.id! <= lastReadMessageId) {
            draft.chats.chats[chatListIndex].lastMessage!.state = MessageState.READ;
          }

          const profileService = new MyProfileService();
          const currentUserId = profileService.myProfile.id;

          if (action.payload.userReaderId === currentUserId) {
            draft.chats.chats[chatListIndex].unreadMessagesCount = 0;
          }
        }

        // messages update
        const chatMessagesIndex = getMessagesChatIndex(draft.messages, chatId);

        if (chatMessagesIndex !== -1) {
          draft.messages.messages[chatMessagesIndex].messages.map((message) => {
            if (message.id <= lastReadMessageId) {
              message.state = MessageState.READ;
            }
            return message;
          });
        }

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));
    };
  }
}
