import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { INormalizedChat } from '../../models/chat';

export class ChangeChatInfoOpened {
  static get action() {
    return createAction('CHANGE_CHAT_INFO_OPENED')<number | undefined>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof ChangeChatInfoOpened.action>) => {
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
                photos: [],
                loading: false,
                hasMore: true,
              },
              videos: {
                videos: [],
                loading: false,
                hasMore: true,
              },
              audios: {
                audios: [],
                loading: false,
                hasMore: true,
              },
              files: {
                files: [],
                loading: false,
                hasMore: true,
              },
              members: {
                memberIds: [],
                loading: false,
                hasMore: true,
              },
              possibleMembers: {
                data: [],
                loading: false,
                hasMore: true,
              },
              recordings: {
                recordings: [],
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
              draftMessages: {},
            };

            draft.chats[chatId] = chat;
          }
        } else {
          draft.chatInfo.isInfoOpened = !draft.chatInfo.isInfoOpened;
        }
        draft.chatInfo.chatId = chatId;

        return draft;
      },
    );
  }
}
