import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createSystemMessage } from '@utils/message-utils';

import { ChatId } from '../../chat-id';
import {
  INormalizedChat,
  INormalizedMessage,
  InterlocutorType,
  MessageState,
  SystemMessageType,
} from '../../models';

import { ICreateGroupChatActionPayload } from './action-payloads/create-group-chat-action-payload';
import { ICerateGroupChatApiRequest } from './api-requests/create-group-chat-api-request';
import { CreateGroupChatSuccess } from './create-group-chat-success';

export class CreateGroupChat {
  static get action() {
    return createAction('CREATE_GROUP_CHAT')<
      ICreateGroupChatActionPayload,
      Meta<INormalizedChat>
    >();
  }

  static get saga() {
    return function* createGroupChat(
      action: ReturnType<typeof CreateGroupChat.action>,
    ): SagaIterator {
      const { userIds, name, avatar, description, currentUserId } = action.payload;

      const groupChatCreationRequest: ICerateGroupChatApiRequest = {
        name,
        description,
        userIds,
        avatarId: avatar?.id,
      };

      const { data } = CreateGroupChat.httpRequest.call(
        yield call(() => CreateGroupChat.httpRequest.generator(groupChatCreationRequest)),
      );

      const chatId: number = ChatId.from(undefined, data).id;

      const firstMessage: INormalizedMessage = {
        creationDateTime: new Date().toISOString(),
        id: new Date().getTime(),
        systemMessageType: SystemMessageType.GroupChatCreated,
        text: createSystemMessage({}),
        chatId,
        state: MessageState.LOCALMESSAGE,
        userCreatorId: currentUserId,
        isDeleted: false,
        isEdited: false,
      };

      const chat: INormalizedChat = {
        interlocutorType: InterlocutorType.GroupChat,
        unreadMessagesCount: 0,
        id: chatId,
        isMuted: false,
        draftMessage: '',
        groupChat: {
          id: data,
          membersCount: userIds.length + 1,
          name,
          description,
          avatar: action.payload.avatar,
          userCreatorId: currentUserId,
        },
        typingInterlocutors: [],
        lastMessage: firstMessage,
        photos: {
          hasMore: true,
          loading: false,
          photos: [],
        },
        members: {
          hasMore: true,
          loading: false,
          memberIds: [],
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
        audios: {
          hasMore: true,
          loading: false,
          audios: [],
        },
        recordings: {
          hasMore: true,
          loading: false,
          recordings: [],
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
      action.meta.deferred?.resolve(chat);
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<number>, ICerateGroupChatApiRequest>(
      MAIN_API.GROUP_CHAT,
      HttpRequestMethod.Post,
    );
  }
}
