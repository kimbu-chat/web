import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { Meta } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { getSelectedChatIdSelector } from '../../selectors';
import { MessageUtils } from '../../../../utils/message-utils';
import { ChatId } from '../../chat-id';
import { IChat, IMessage, InterlocutorType, MessageState, SystemMessageType } from '../../models';
import { ChangeSelectedChat } from '../change-selected-chat/change-selected-chat';
import { ICreateGroupChatActionPayload } from './action-payloads/create-group-chat-action-payload';
import { CreateGroupChatSuccess } from './create-group-chat-success';
import { ICerateGroupChatApiRequest } from './api-requests/create-group-chat-api-request';
import { IChatsState } from '../../chats-state';

export class CreateGroupChat {
  static get action() {
    return createAction('CREATE_GROUP_CHAT')<ICreateGroupChatActionPayload, Meta<IChat>>();
  }

  // TODO: handle loading
  static get reducer() {
    return produce((draft: IChatsState) => draft);
  }

  static get saga() {
    return function* createGroupChat(action: ReturnType<typeof CreateGroupChat.action>): SagaIterator {
      const { userIds, name, avatar, description, currentUser } = action.payload;
      const selectedChatId = yield select(getSelectedChatIdSelector);

      const groupChatCreationRequest: ICerateGroupChatApiRequest = {
        name,
        description,
        userIds,
        avatarId: avatar?.id,
      };

      const { data } = CreateGroupChat.httpRequest.call(yield call(() => CreateGroupChat.httpRequest.generator(groupChatCreationRequest)));

      const chatId: number = ChatId.from(undefined, data).id;

      const firstMessage: IMessage = {
        creationDateTime: new Date(),
        id: new Date().getTime(),
        systemMessageType: SystemMessageType.GroupChatCreated,
        text: MessageUtils.createSystemMessage({}),
        chatId,
        state: MessageState.LOCALMESSAGE,
        userCreator: action.payload.currentUser,
        isDeleted: false,
        isEdited: false,
      };

      const chat: IChat = {
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
          userCreatorId: currentUser.id,
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
          members: [],
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
      };

      yield put(CreateGroupChatSuccess.action(chat));
      yield put(ChangeSelectedChat.action({ newChatId: chat.id, oldChatId: selectedChatId }));
      action.meta.deferred?.resolve(chat);
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<number>, ICerateGroupChatApiRequest>(`${process.env.MAIN_API}/api/group-chats`, HttpRequestMethod.Post);
  }
}
