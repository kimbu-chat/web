import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { playSoundSafely } from '../../../../utils/current-music';
import messageCameUnselected from '../../../../assets/sounds/notifications/messsage-came-unselected.ogg';
import { MessageUtils } from '../../../../utils/message-utils';
import { ChatId } from '../../chat-id';
import { IMessage, SystemMessageType, MessageState, IChat, InterlocutorType } from '../../models';
import { getChatExistsDraftSelector } from '../../selectors';
import { IGroupChatCreatedIntegrationEvent } from './group-chat-сreated-integration-event';
import { IChatsState } from '../../chats-state';

export class GroupChatCreatedEventHandler {
  static get action() {
    return createAction('GroupChatCreated')<IGroupChatCreatedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GroupChatCreatedEventHandler.action>) => {
      const { description, id, memberIds, name, systemMessageId, userCreator, userCreatorId, avatarId, avatarUrl, avatarPreviewUrl } = payload;
      const chatId = ChatId.from(undefined, id).id;

      const doesChatExists: boolean = getChatExistsDraftSelector(chatId, draft);

      if (doesChatExists) {
        return draft;
      }

      const audioUnselected = new Audio(messageCameUnselected);
      playSoundSafely(audioUnselected);

      const messageOfCreation: IMessage = {
        systemMessageType: SystemMessageType.GroupChatCreated,
        text: MessageUtils.createSystemMessage({}),
        creationDateTime: new Date(new Date().toUTCString()),
        userCreator,
        state: MessageState.READ,
        chatId,
        id: systemMessageId,
        isDeleted: false,
        isEdited: false,
      };

      const newChat: IChat = {
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
          members: [],
        },
      };

      if (newChat.groupChat && avatarId && avatarUrl && avatarPreviewUrl) {
        newChat.groupChat.avatar = {
          id: avatarId,
          url: avatarUrl,
          previewUrl: avatarPreviewUrl,
        };
      }

      draft.chats.unshift(newChat);

      return draft;
    });
  }
}
