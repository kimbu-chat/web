import { createAction } from '@reduxjs/toolkit';
import { IUser } from 'kimbu-models';

import { INormalizedChat, InterlocutorType } from '@store/chats/models';
import { playSoundSafely } from '@utils/current-music';

import messageCameUnselected from '../../../../assets/sounds/notifications/messsage-came-unselected.ogg';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import { getChatExistsDraftSelector } from '../../selectors';

export interface IGroupChatCreatedIntegrationEvent {
  description?: string;
  id: number;
  memberIds: number[];
  name: string;
  userCreator: IUser;
  userCreatorId: number;
  avatarId?: number;
  avatarUrl?: string;
  avatarPreviewUrl?: string;
}

export class GroupChatCreatedEventHandler {
  static get action() {
    return createAction<IGroupChatCreatedIntegrationEvent>('GroupChatCreated');
  }

  static get reducer() {
    return (
      draft: IChatsState,
      { payload }: ReturnType<typeof GroupChatCreatedEventHandler.action>,
    ) => {
      const {
        description,
        id,
        memberIds,
        name,
        userCreatorId,
        avatarId,
        avatarUrl,
        avatarPreviewUrl,
      } = payload;
      const chatId = ChatId.from(undefined, id).id;

      const doesChatExists: boolean = getChatExistsDraftSelector(chatId, draft);

      if (doesChatExists) {
        return draft;
      }

      const audioUnselected = new Audio(messageCameUnselected);
      playSoundSafely(audioUnselected);

      const newChat: INormalizedChat = {
        id: chatId,
        interlocutorType: InterlocutorType.GroupChat,
        unreadMessagesCount: 0,
        groupChat: {
          id,
          name,
          description,
          membersCount: memberIds.length,
          userCreatorId,
        },
        isMuted: false,
        photos: {
          hasMore: true,
          loading: false,
          data: [],
        },
        videos: {
          hasMore: true,
          loading: false,
          data: [],
        },
        audios: {
          hasMore: true,
          loading: false,
          data: [],
        },
        files: {
          hasMore: true,
          loading: false,
          data: [],
        },
        recordings: {
          hasMore: true,
          loading: false,
          data: [],
        },
        possibleMembers: {
          memberIds: [],
          loading: false,
          hasMore: true,
        },
        messages: {
          messages: {},
          messageIds: [],
          hasMore: true,
          loading: false,
        },
        isBlockedByInterlocutor: false,
        isBlockedByUser: false,
        isInContacts: false,
        isDismissedAddToContacts: false,
      };

      if (newChat.groupChat && avatarId && avatarUrl && avatarPreviewUrl) {
        newChat.groupChat.avatar = {
          id: avatarId,
          url: avatarUrl,
          previewUrl: avatarPreviewUrl,
        };
      }

      if (!draft.chats[newChat.id]) {
        draft.chatList.chatIds.unshift(newChat.id);
        draft.chats[newChat.id] = newChat;
      }

      return draft;
    };
  }
}
