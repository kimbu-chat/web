import { IMessage, MessageState, SystemMessageType } from 'app/store/messages/models';
import { MessageCreatedEventHandler } from 'app/store/messages/socket-events/message-created/message-created-event-handler';
import { IGroupChatCreatedIntegrationEvent } from 'app/store/middlewares/websockets/integration-events/group-chat-сreated-integration-event';
import { MessageUtils } from 'app/utils/message-utils';
import { SagaIterator } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';

export class CreateGroupChatFromEvent {
  static get action() {
    return createAction('CREATE_GROUP_CHAT_FROM_EVENT')<IGroupChatCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CreateGroupChatFromEvent.action>): SagaIterator {
      const { payload } = action;
      const chatId: number = ChatId.from(undefined, payload.id).id;

      const message: IMessage = {
        systemMessageType: SystemMessageType.GroupChatCreated,
        text: MessageUtils.createSystemMessage({}),
        creationDateTime: new Date(new Date().toUTCString()),
        userCreator: action.payload.userCreator,
        state: MessageState.READ,
        chatId,
        id: payload.systemMessageId,
      };

      yield put(MessageCreatedEventHandler.action(message));
    };
  }
}
