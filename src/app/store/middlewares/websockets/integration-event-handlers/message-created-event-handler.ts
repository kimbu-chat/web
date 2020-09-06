import { Store } from 'redux';
import { MessageCreatedIntegrationEvent } from '../integration-events/message-created-integration-event';
import { SystemMessageType, Message, MessageState, CreateMessageRequest } from 'app/store/messages/models';
import { InterlocutorType, Dialog } from 'app/store/dialogs/models';
import { DialogService } from 'app/store/dialogs/dialog-service';
import { IEventHandler } from '../event-handler';
import { RootState } from 'app/store/root-reducer';
import { MessageActions } from 'app/store/messages/actions';

export class MessageCreatedEventHandler implements IEventHandler<MessageCreatedIntegrationEvent> {
	public handle(store: Store<RootState>, eventData: MessageCreatedIntegrationEvent): void {
		const currentUserId: number = store.getState().myProfile.user?.id || -1;
		const shouldHandleMessageCreation: boolean =
			eventData.userCreatorId !== currentUserId || eventData.systemMessageType !== SystemMessageType.None;

		if (!shouldHandleMessageCreation) {
			return;
		}

		const interlocutorType: InterlocutorType =
			eventData.destinationType === 'Conference' ? InterlocutorType.CONFERENCE : InterlocutorType.USER;

		const dialogId: number = DialogService.getDialogId(eventData.userCreatorId, eventData.destinationId);

		const message: Message = {
			text: eventData.text,
			systemMessageType: eventData.systemMessageType,
			dialogId: dialogId,
			creationDateTime: new Date(new Date().toUTCString()),
			id: eventData.objectId,
			state: MessageState.READ,
			userCreator: eventData.userCreator,
		};

		const dialog: Dialog = {
			id: dialogId,
			interlocutor: interlocutorType === InterlocutorType.CONFERENCE ? null : eventData.userCreator,
			interlocutorType: interlocutorType,
			conference: interlocutorType === InterlocutorType.CONFERENCE ? { id: eventData.destinationId } : null,
			lastMessage: message,
		};

		if (eventData.systemMessageType === SystemMessageType.ConferenceMemberRemoved) {
			if (eventData.userCreatorId === currentUserId) {
				// if (DialogRepository.getDialogExistence(dialogId)) {
				//   //delete local dialog on another device on the same user
				// }
				return;
			}
		} else if (eventData.systemMessageType === SystemMessageType.ConferenceMemberAdded) {
			// if (!DialogRepository.getDialogExistence(dialogId)) {
			//   const messageContent = Helpers.getSystemMessageContent(eventData.text) as ConfereceMemberAddedSystemMessageContent;
			//   dialog.conference.membersCount = messageContent.conferenceMembersNumber;
			//   dialog.conference.avatarUrl = messageContent.conferenceAvatarUrl;
			//   dialog.conference.name = messageContent.conferenceName;
			//   dialog.lastMessage = message;
			//   DialogRepository.addOrUpdateDialogs([dialog]);
			// }
		}

		const messageCreation: CreateMessageRequest = {
			message: message,
			dialog: dialog,
			currentUser: { id: currentUserId },
			selectedDialogId: store.getState().dialogs.selectedDialogId as number,
			isFromEvent: true,
		};

		store.dispatch(MessageActions.createMessage(messageCreation));
	}
}
