import { MyProfileService } from 'app/services/my-profile-service';
import { CreateMessage } from 'app/store/messages/features/create-message/create-message';
import { IMessage, MessageState, SystemMessageType } from 'app/store/messages/models';
import { IGroupChatCreatedIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/group-chat-сreated-integration-event';
import { MessageUtils } from 'app/utils/message-utils';
import { SagaIterator } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ICreateMessageActionPayload } from 'store/messages/features/create-message/create-message-action-payload';
import { ChatId } from '../../chat-id';
import { IChat, IGroupChat, InterlocutorType } from '../../models';

export class CreateGroupChatFromEvent {
  static get action() {
    return createAction('CREATE_GROUP_CHAT_FROM_EVENT')<IGroupChatCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CreateGroupChatFromEvent.action>): SagaIterator {
      const { payload } = action;
      const chatId: number = ChatId.from(undefined, payload.id).id;
      const currentUser = new MyProfileService().myProfile;

      const message: IMessage = {
        systemMessageType: SystemMessageType.GroupChatCreated,
        text: MessageUtils.createSystemMessage({}),
        creationDateTime: new Date(new Date().toUTCString()),
        userCreator: action.payload.userCreator,
        state: MessageState.READ,
        chatId,
        id: payload.systemMessageId,
      };

      const chat: IChat = {
        interlocutorType: InterlocutorType.GROUP_CHAT,
        id: chatId,
        draftMessage: '',
        groupChat: {
          id: payload.id,
          membersCount: payload.memberIds.length,
          name: action.payload.name,
        } as IGroupChat,
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

      const createMessageRequest: ICreateMessageActionPayload = {
        message,
        isFromEvent: true,
        currentUserId: currentUser.id,
        chatId: chat.id,
      };

      yield put(CreateMessage.action(createMessageRequest));
    };
  }
}
