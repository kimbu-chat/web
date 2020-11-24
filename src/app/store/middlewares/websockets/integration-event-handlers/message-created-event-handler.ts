import { Store } from 'redux';
import { MessageCreatedIntegrationEvent } from '../integration-events/message-created-integration-event';
import { SystemMessageType, Message, MessageState, CreateMessageRequest } from 'store/messages/models';
import { IEventHandler } from '../event-handler';
import { RootState } from 'store/root-reducer';
import { MessageActions } from 'store/messages/actions';

export class MessageCreatedEventHandler implements IEventHandler<MessageCreatedIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: MessageCreatedIntegrationEvent): void {
		const currentUserId: number = store.getState().myProfile.user?.id || -1;

		const message: Message = {
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

		const messageCreation: CreateMessageRequest = {
			message: message,
			isFromEvent: true,
			chatId: eventData.chatId,
			currentUserId,
		};

		store.dispatch(MessageActions.createMessage(messageCreation));
	}
}
