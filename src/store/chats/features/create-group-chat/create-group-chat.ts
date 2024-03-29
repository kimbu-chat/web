import { AxiosResponse } from 'axios';
import { IAvatar, ICreateGroupChatRequest, ICreateGroupChatResponse } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedChat, InterlocutorType } from '@store/chats/models';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { ChatId } from '../../chat-id';

import { CreateGroupChatSuccess } from './create-group-chat-success';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: number[];
  currentUserId: number;
  avatar?: IAvatar;
}

export class CreateGroupChat {
  static get action() {
    return createDeferredAction<ICreateGroupChatActionPayload, INormalizedChat>(
      'CREATE_GROUP_CHAT',
    );
  }

  static get saga() {
    return function* createGroupChat(
      action: ReturnType<typeof CreateGroupChat.action>,
    ): SagaIterator {
      const { userIds, name, avatar, description, currentUserId } = action.payload;

      const groupChatCreationRequest: ICreateGroupChatRequest = {
        name,
        description,
        userIds,
        avatarId: avatar?.id,
      };

      const { data } = CreateGroupChat.httpRequest.call(
        yield call(() => CreateGroupChat.httpRequest.generator(groupChatCreationRequest)),
      );

      const groupChatId = data.id;

      const chatId = ChatId.from(undefined, groupChatId).id;

      const chat: INormalizedChat = {
        interlocutorType: InterlocutorType.GroupChat,
        unreadMessagesCount: 0,
        id: chatId,
        isMuted: false,
        groupChat: {
          id: groupChatId,
          membersCount: userIds.length + 1,
          name,
          description,
          avatar: action.payload.avatar,
          userCreatorId: currentUserId,
        },
        typingInterlocutors: [],
        photos: {
          hasMore: true,
          loading: false,
          data: [],
        },
        possibleMembers: {
          memberIds: [],
          loading: false,
          hasMore: true,
        },
        videos: {
          hasMore: true,
          loading: false,
          data: [],
        },
        files: {
          hasMore: true,
          loading: false,
          data: [],
        },
        audios: {
          hasMore: true,
          loading: false,
          data: [],
        },
        recordings: {
          hasMore: true,
          loading: false,
          data: [],
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

      yield put(CreateGroupChatSuccess.action(chat));
      action.meta?.deferred?.resolve(chat);
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICreateGroupChatResponse>, ICreateGroupChatRequest>(
      MAIN_API.GROUP_CHAT,
      HttpRequestMethod.Post,
    );
  }
}
