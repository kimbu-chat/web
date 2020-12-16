import { Meta } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { SystemMessageType, MessageState } from 'app/store/messages/models';
import { ApiBasePath } from 'app/store/root-api';
import { MessageUtils } from 'app/utils/functions/message-utils';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { ChatId } from '../../chat-id';
import { GroupChatCreationHTTPReqData, Chat, InterlocutorType } from '../../models';
import { ChangeSelectedChat } from '../change-selected-chat/change-selected-chat';
import { CreateGroupChatActionPayload } from './create-group-chat-action-payload';
import { CreateGroupChatSuccess } from './create-group-chat-success';

export class CreateGroupChat {
  static get action() {
    return createAction('CREATE_GROUP_CHAT')<CreateGroupChatActionPayload, Meta>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CreateGroupChat.action>): SagaIterator {
      const { userIds, name, avatar, description, currentUser } = action.payload;
      const selectedChatId = yield select(getSelectedChatIdSelector);

      try {
        const groupChatCreationRequest: GroupChatCreationHTTPReqData = {
          name,
          description,
          userIds,
          avatarId: avatar?.id,
        };

        const { data } = CreateGroupChat.httpRequest.call(yield call(() => CreateGroupChat.httpRequest.generator(groupChatCreationRequest)));

        const chatId: number = new ChatId().From(undefined, data).entireId;
        const chat: Chat = {
          interlocutorType: InterlocutorType.GROUP_CHAT,
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
            loading: false,
            photos: [],
          },
          members: {
            hasMore: true,
            loading: false,
            members: [],
            searchMembers: [],
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
