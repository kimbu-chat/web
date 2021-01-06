import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { getChatExistsDraftSelector } from 'app/store/chats/selectors';
import { ChatId } from '../../chat-id';
import { IChat, IChatsState, InterlocutorType } from '../../models';
import { ICreateChatActionPayload } from './action-payloads/create-chat-action-payload';

export class CreateChat {
  static get action() {
    return createAction('CREATE_CHAT')<ICreateChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof CreateChat.action>) => {
      const { id } = payload;

      const chatId: number = ChatId.from(id).id;

      const isChatExists = getChatExistsDraftSelector(chatId, draft);

      draft.selectedChatId = chatId;

      if (isChatExists) {
        return draft;
      }
      // user does not have dialog with interlocutor - create dialog
      const newChat: IChat = {
        id: chatId,
        interlocutorType: InterlocutorType.User,
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
        messages: {
          hasMore: true,
          loading: false,
          messages: [],
        },
      };

      draft.chats.unshift(newChat);

      return draft;
    });
  }
}
