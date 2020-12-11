import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { checkChatExists } from '../../chats-utils';
import { ChatsState, Chat } from '../../models';
import { CreateChatActionPayload } from './create-chat-action-payload';

export class CreateChat {
  static get action() {
    return createAction('CREATE_CHAT')<CreateChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof CreateChat.action>) => {
      const { id } = payload;

      const chatId: number = new ChatId().From(id).entireId;

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
          photos: [],
        },
        videos: {
          hasMore: true,
          videos: [],
        },
        files: {
          hasMore: true,
          files: [],
        },
        recordings: {
          hasMore: true,
          recordings: [],
        },
        audios: {
          hasMore: true,
          audios: [],
        },
      };

      draft.chats.unshift(newChat);

      return draft;
    });
  }
}
