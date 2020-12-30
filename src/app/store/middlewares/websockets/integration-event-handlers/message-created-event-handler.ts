import { Store } from 'redux';
import { SystemMessageType, IMessage, MessageState } from 'store/messages/models';
import { RootState } from 'store/root-reducer';
import { MessageActions } from 'store/messages/actions';
import { ICreateMessageActionPayload } from 'store/messages/features/create-message/create-message-action-payload';
import { IEventHandler } from '../event-handler';
import { IMessageCreatedIntegrationEvent } from '../integration-events/message-created-integration-event';

export class MessageCreatedEventHandler implements IEventHandler<IMessageCreatedIntegrationEvent> {
  public handle(store: Store<RootState>, eventData: IMessageCreatedIntegrationEvent): void {
    const currentUserId: number = store.getState().myProfile.user?.id!;

    const message: IMessage = {
      attachments: eventData.attachments,
      text: eventData.text,
      systemMessageType: eventData.systemMessageType,
      chatId: eventData.chatId,
      creationDateTime: new Date(new Date().toUTCString()),
      id: eventData.id,
      state: MessageState.SENT,
      userCreator: eventData.userCreator,
    };

    if (eventData.systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
      if (eventData.userCreatorId === currentUserId) {
        return;
      }
    }

    const messageCreation: ICreateMessageActionPayload = {
      message,
      isFromEvent: true,
      chatId: eventData.chatId,
      currentUserId,
    };

    store.dispatch(MessageActions.createMessage(messageCreation));
  }
}
