import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { createSystemMessage } from '@utils/message-utils';

import messageCameUnselected from '../../../../assets/sounds/notifications/messsage-came-unselected.ogg';
import { playSoundSafely } from '../../../../utils/current-music';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import {
  SystemMessageType,
  MessageState,
  INormalizedChat,
  InterlocutorType,
  INormalizedMessage,
} from '../../models';
import { getChatExistsDraftSelector } from '../../selectors';

import { IGroupChatCreatedIntegrationEvent } from './group-chat-сreated-integration-event';

export class GroupChatCreatedEventHandler {
  static get action() {
    return createAction('GroupChatCreated')<IGroupChatCreatedIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof GroupChatCreatedEventHandler.action>) => {
        const {
          description,
          id,
          memberIds,
          name,
          systemMessageId,
          userCreator,
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

        const messageOfCreation: INormalizedMessage = {
          systemMessageType: SystemMessageType.GroupChatCreated,
          text: createSystemMessage({}),
          creationDateTime: new Date().toISOString(),
          userCreatorId: userCreator.id,
          state: MessageState.READ,
          chatId,
          id: systemMessageId,
          isDeleted: false,
          isEdited: false,
        };

        const newChat: INormalizedChat = {
          id: chatId,
          interlocutorType: InterlocutorType.GroupChat,
          unreadMessagesCount: 1,
          lastMessage: messageOfCreation,
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
            photos: [],
          },
          videos: {
            hasMore: true,
            loading: false,
            videos: [],
          },
          audios: {
            hasMore: true,
            loading: false,
            audios: [],
          },
          files: {
            hasMore: true,
            loading: false,
            files: [],
          },
          recordings: {
            hasMore: true,
            loading: false,
            recordings: [],
          },
          members: {
            hasMore: true,
            loading: false,
            memberIds: [],
          },
          messages: {
            messages: [],
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
      },
    );
  }
}
