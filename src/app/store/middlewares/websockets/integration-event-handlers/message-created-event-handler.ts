import { Store } from 'redux';
import { MessageCreatedIntegrationEvent } from '../integration-events/message-created-integration-event';
import { SystemMessageType, Message, MessageState, CreateMessageRequest } from 'app/store/messages/models';
import { InterlocutorType, Chat, GroupChat } from 'app/store/chats/models';
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
			eventData.chatId % 10 === InterlocutorType.GROUP_CHAT ? InterlocutorType.GROUP_CHAT : InterlocutorType.USER;

		const message: Message = {
			text: eventData.text,
			systemMessageType: eventData.systemMessageType,
			chatId: eventData.chatId,
			creationDateTime: new Date(new Date().toUTCString()),
			id: eventData.id,
			state: MessageState.READ,
			userCreator: { ...eventData.userCreator, id: eventData.userCreatorId },
		};

		const chat: Chat = {
			id: eventData.chatId,
			draftMessage: '',
			interlocutor: interlocutorType === InterlocutorType.GROUP_CHAT ? undefined : eventData.userCreator,
			interlocutorType: interlocutorType,
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

		if (interlocutorType === InterlocutorType.GROUP_CHAT) {
			chat.groupChat = { id: Number(String(eventData.chatId).split('2')[0]) } as GroupChat;
		}

		if (eventData.systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
			if (eventData.userCreatorId === currentUserId) {
				return;
			}
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
