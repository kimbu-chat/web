import { createAction } from '@reduxjs/toolkit';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { INormalizedChat } from '../../models/chat';

export class ChangeChatInfoOpened {
  static get action() {
    return createAction<number | undefined>('CHANGE_CHAT_INFO_OPENED');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof ChangeChatInfoOpened.action>) => {
      const chatId = payload;

      if (chatId) {
        draft.chatInfo.isInfoOpened = true;
        if (!draft.chats[chatId]) {
          const { interlocutorId, interlocutorType } = ChatId.fromId(chatId);

          const chat: INormalizedChat = {
            id: chatId,
            interlocutorType,
            lastMessageId: undefined,
            interlocutorId,
            unreadMessagesCount: 0,
            isGeneratedLocally: true,

            photos: {
              data: [],
              loading: false,
              hasMore: true,
            },
            videos: {
              data: [],
              loading: false,
              hasMore: true,
            },
            audios: {
              data: [],
              loading: false,
              hasMore: true,
            },
            files: {
              data: [],
              loading: false,
              hasMore: true,
            },
            members: {
              memberIds: [],
              loading: false,
              hasMore: true,
            },
            possibleMembers: {
              memberIds: [],
              loading: false,
              hasMore: true,
            },
            recordings: {
              data: [],
              loading: false,
              hasMore: true,
            },

            messages: {
              messages: {},
              messageIds: [],
              loading: false,
              hasMore: true,
            },

            isBlockedByInterlocutor: false,
            isBlockedByUser: false,
            isInContacts: false,
            isDismissedAddToContacts: false,
          };

          draft.chats[chatId] = chat;
        }
      } else {
        draft.chatInfo.isInfoOpened = !draft.chatInfo.isInfoOpened;
      }
      draft.chatInfo.chatId = chatId;

      return draft;
    };
  }
}
