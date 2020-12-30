import { MessageState } from 'app/store/messages/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { MyProfileService } from 'app/services/my-profile-service';
import { IChatsState } from '../../models';
import { IChangeInterlocutorLastReadMessageIdActionPayload } from './change-interlocutor-last-read-message-id-action-payload';

export class ChangeInterlocutorLastReadMessageId {
  static get action() {
    return createAction('GROUP_CHAT_MESSAGE_READ_FROM_EVENT')<IChangeInterlocutorLastReadMessageIdActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeInterlocutorLastReadMessageId.action>) => {
      const { lastReadMessageId, chatId } = payload;

      const chatIndex = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].interlocutorLastReadMessageId = lastReadMessageId;

        if (draft.chats[chatIndex].lastMessage?.id! <= lastReadMessageId) {
          draft.chats[chatIndex].lastMessage!.state = MessageState.READ;
        }

        const profileService = new MyProfileService();
        const currentUserId = profileService.myProfile.id;

        if (payload.userReaderId === currentUserId) {
          draft.chats[chatIndex].unreadMessagesCount = 0;
        }
      }

      return draft;
    });
  }
}
