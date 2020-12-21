import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { checkChatExists } from 'app/store/chats/selectors';
import { ChatId } from '../../chat-id';
import { ChatsState, Chat } from '../../models';
import { CreateChatActionPayload } from './create-chat-action-payload';

export class CreateChat {
  static get action() {
    return createAction('CREATE_CHAT')<CreateChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof CreateChat.action>) => {
      const { id } = payload;

      const chatId: number = ChatId.from(id).id;

      const isChatExists = checkChatExists(chatId, draft);

      draft.selectedChatId = chatId;

      if (isChatExists) {
        return draft;
      }
      // user does not have dialog with interlocutor - create dialog
      const newChat: Chat = {
        id: chatId,
        draftMessage: '',
        interlocutorType: 1,
        unreadMessagesCount: 0,
        interlocutorLastReadMessageId: 0,
        interlocutor: payload,
        typingInterlocutors: [],
        photos: {
          hasMore: true,
          loading: false,
          photos: [],
        },
        videos: {
          hasMore: true,
          loading: false,
          videos: [],
        },
        files: {
          hasMore: true,
          loading: false,
          files: [],
        },
        members: {
          hasMore: true,
          loading: false,
          members: [],
          searchMembers: [],
        },
        recordings: {
          hasMore: true,
          loading: false,
          recordings: [],
        },
        audios: {
          hasMore: true,
          loading: false,
          audios: [],
        },
      };

      draft.chats.unshift(newChat);

      return draft;
    });
  }
}
