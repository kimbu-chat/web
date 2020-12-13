import { MyProfileService } from 'app/services/my-profile-service';
import { CreateMessage } from 'app/store/messages/features/create-message/create-message';
import { Message, SystemMessageType, MessageState } from 'app/store/messages/models';
import { GroupChatCreatedIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/group-chat-сreated-integration-event';
import { MessageUtils } from 'app/utils/functions/message-utils';
import { SagaIterator } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { CreateMessageActionPayload } from '../../../messages/features/create-message/create-message-action-payload';
import { ChatId } from '../../chat-id';
import { Chat, InterlocutorType, GroupChat } from '../../models';

export class CreateGroupChatFromEvent {
  static get action() {
    return createAction('CREATE_GROUP_CHAT_FROM_EVENT')<GroupChatCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CreateGroupChatFromEvent.action>): SagaIterator {
      const { payload } = action;
      const chatId: number = new ChatId().From(undefined, payload.id).entireId;
      const currentUser = new MyProfileService().myProfile;

      const message: Message = {
        systemMessageType: SystemMessageType.GroupChatCreated,
        text: MessageUtils.createSystemMessage({}),
        creationDateTime: new Date(new Date().toUTCString()),
        userCreator: action.payload.userCreator,
        state: MessageState.READ,
        chatId,
        id: payload.systemMessageId,
      };

      const chat: Chat = {
        interlocutorType: InterlocutorType.GROUP_CHAT,
        id: chatId,
        draftMessage: '',
        groupChat: {
          id: payload.id,
          membersCount: payload.memberIds.length,
          name: action.payload.name,
        } as GroupChat,
        lastMessage: message,
        typingInterlocutors: [],
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
        members: {
          hasMore: true,
          loading: false,
          members: [],
          searchMembers: [],
        },
      };

      const createMessageRequest: CreateMessageActionPayload = {
        message,
        isFromEvent: true,
        currentUserId: currentUser.id,
        chatId: chat.id,
      };

      yield put(CreateMessage.action(createMessageRequest));
    };
  }
}
