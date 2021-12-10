import produce from 'immer';
import { createAction } from 'typesafe-actions';

import { MyProfileService } from '@services/my-profile-service';
import { INormalizedChat, InterlocutorType } from '@store/chats/models';

import messageCameUnselected from '../../../../assets/sounds/notifications/messsage-came-unselected.ogg';
import { playSoundSafely } from '../../../../utils/current-music';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
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
          userCreator,
          userCreatorId,
          avatarId,
          avatarUrl,
          avatarPreviewUrl,
        } = payload;
        const chatId = ChatId.from(undefined, id).id;

        const doesChatExists: boolean = getChatExistsDraftSelector(chatId, draft);
        const myId = new MyProfileService().myProfile.id;

        if (doesChatExists) {
          return draft;
        }

        const audioUnselected = new Audio(messageCameUnselected);
        playSoundSafely(audioUnselected);

        const newChat: INormalizedChat = {
          id: chatId,
          interlocutorType: InterlocutorType.GroupChat,
          unreadMessagesCount: myId === userCreator.id ? 0 : 1,
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
          possibleMembers: {
            data: [],
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
      },
    );
  }
}
