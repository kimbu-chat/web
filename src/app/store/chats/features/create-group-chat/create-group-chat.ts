import { Meta } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { SystemMessageType, MessageState } from 'app/store/messages/models';
import { ApiBasePath } from 'app/store/root-api';
import { MessageUtils } from 'app/utils/functions/message-utils';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { GroupChatCreationReqData, GroupChatCreationHTTPReqData, Chat, InterlocutorType } from '../../models';
import { ChangeSelectedChat } from '../change-selected-chat/change-selected-chat';
import { CreateGroupChatSuccess } from './create-group-chat-success';

export class CreateGroupChat {
  static get action() {
    return createAction('CREATE_GROUP_CHAT')<GroupChatCreationReqData, Meta>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CreateGroupChat.action>): SagaIterator {
      const { userIds, name, avatar, description, currentUser } = action.payload;

      try {
        const groupChatCreationRequest: GroupChatCreationHTTPReqData = {
          name,
          description,
          userIds,
          currentUser,
          avatarId: avatar?.id,
        };

        const { data } = CreateGroupChat.httpRequest.call(yield call(() => CreateGroupChat.httpRequest.generator(groupChatCreationRequest)));

        const chatId: number = new ChatId().From(undefined, data).entireId;
        const chat: Chat = {
          interlocutorType: InterlocutorType.GROUP_CHAT,
          id: chatId,
          draftMessage: '',
          groupChat: {
            id: data,
            membersCount: userIds.length + 1,
            name,
            avatar: action.payload.avatar,
            userCreatorId: currentUser.id,
          },
          typingInterlocutors: [],
          lastMessage: {
            creationDateTime: new Date(),
            id: new Date().getTime(),
            systemMessageType: SystemMessageType.GroupChatCreated,
            text: MessageUtils.createSystemMessage({}),
            chatId,
            state: MessageState.LOCALMESSAGE,
            userCreator: action.payload.currentUser,
          },
          photos: {
            hasMore: true,
            photos: [],
          },
          videos: {
            hasMore: true,
            videos: [],
          },
          files: {
            hasMore: true,
            files: [],
          },
          audios: {
            hasMore: true,
            audios: [],
          },
          recordings: {
            hasMore: true,
            recordings: [],
          },
        };

        yield put(CreateGroupChatSuccess.action(chat));
        yield put(ChangeSelectedChat.action(chat.id));
        action.meta.deferred?.resolve(chat);
      } catch (e) {
        console.warn(e);
        alert('createGroupChatSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<number>, GroupChatCreationHTTPReqData>(`${ApiBasePath.MainApi}/api/group-chats`, HttpRequestMethod.Post);
  }
}