import { Store } from 'redux';
import { MessageCreatedIntegrationEvent } from '../integration-events/message-created-integration-event';
import { SystemMessageType, Message, MessageState, CreateMessageRequest } from 'app/store/messages/models';
import { InterlocutorType, Chat } from 'app/store/chats/models';
import { ChatService } from 'app/store/chats/chat-service';
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

		const chatId: number = ChatService.getChatId(
			eventData.destinationType === 'User' ? eventData.userCreatorId : undefined,
			eventData.destinationType === 'Conference' ? eventData.destinationId : undefined,
		);

		const message: Message = {
			text: eventData.text,
			systemMessageType: eventData.systemMessageType,
			chatId: chatId,
			creationDateTime: new Date(new Date().toUTCString()),
			id: eventData.objectId,
			state: MessageState.READ,
			userCreator: { ...eventData.userCreator, id: eventData.userCreatorId },
		};

		const chat: Chat = {
			id: chatId,
			interlocutor: interlocutorType === InterlocutorType.CONFERENCE ? undefined : eventData.userCreator,
			interlocutorType: interlocutorType,
			conference: interlocutorType === InterlocutorType.CONFERENCE ? { id: eventData.destinationId } : undefined,
			lastMessage: message,
			typingInterlocutors: [],
			photos: {
				hasMore: true,
				photos: [],
			},
			videos: {
				hasMore: true,
				videos: [],
			},
		};

		if (eventData.systemMessageType === SystemMessageType.ConferenceMemberRemoved) {
			if (eventData.userCreatorId === currentUserId) {
				// if (ChatRepository.getChatExistence(chatId)) {
				//   //delete local chat on another device on the same user
				// }
				return;
			}
		} else if (eventData.systemMessageType === SystemMessageType.ConferenceMemberAdded) {
			// if (!ChatRepository.getChatExistence(chatId)) {
			//   const messageContent = Helpers.getSystemMessageContent(eventData.text) as ConfereceMemberAddedSystemMessageContent;
			//   chat.conference.membersCount = messageContent.conferenceMembersNumber;
			//   chat.conference.avatarUrl = messageContent.conferenceAvatarUrl;
			//   chat.conference.name = messageContent.conferenceName;
			//   chat.lastMessage = message;
			//   ChatRepository.addOrUpdateChats([chat]);
			// }
		}

		const messageCreation: CreateMessageRequest = {
			message: message,
			chat: chat,
			currentUser: { id: currentUserId },
			selectedChatId: store.getState().chats.selectedChatId as number,
			isFromEvent: true,
		};

		store.dispatch(MessageActions.createMessage(messageCreation));
	}
}
