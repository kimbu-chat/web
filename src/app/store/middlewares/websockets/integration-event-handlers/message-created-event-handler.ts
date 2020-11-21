import { Store } from 'redux';
import { MessageCreatedIntegrationEvent } from '../integration-events/message-created-integration-event';
import { SystemMessageType, Message, MessageState, CreateMessageRequest } from 'app/store/messages/models';
import { InterlocutorType, Chat, GroupChat } from 'app/store/chats/models';
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
			eventData.destinationType === 'GroupChat' ? InterlocutorType.GROUP_CHAT : InterlocutorType.USER;

		const chatId: number = ChatService.getChatId(
			eventData.destinationType === 'User' ? eventData.userCreatorId : undefined,
			eventData.destinationType === 'GroupChat' ? eventData.destinationId : undefined,
		);

		const message: Message = {
			text: eventData.text,
			systemMessageType: eventData.systemMessageType,
			chatId: chatId,
			creationDateTime: new Date(new Date().toUTCString()),
			id: eventData.id,
			state: MessageState.READ,
			userCreator: { ...eventData.userCreator, id: eventData.userCreatorId },
		};

		const chat: Chat = {
			id: chatId,
			draftMessage: '',
			interlocutor: interlocutorType === InterlocutorType.GROUP_CHAT ? undefined : eventData.userCreator,
			interlocutorType: interlocutorType,
			groupChat:
				interlocutorType === InterlocutorType.GROUP_CHAT
					? ({ id: eventData.destinationId } as GroupChat)
					: undefined,
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

		if (eventData.systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
			if (eventData.userCreatorId === currentUserId) {
				// if (ChatRepository.getChatExistence(chatId)) {
				//   //delete local chat on another device on the same user
				// }
				return;
			}
		} else if (eventData.systemMessageType === SystemMessageType.GroupChatMemberAdded) {
			// if (!ChatRepository.getChatExistence(chatId)) {
			//   const messageContent = Helpers.getSystemMessageContent(eventData.text) as GroupChatMemberAddedSystemMessageContent;
			//   chat.groupChat.membersCount = messageContent.groupChatMembersNumber;
			//   chat.groupChat.avatarUrl = messageContent.groupChatAvatarUrl;
			//   chat.groupChat.name = messageContent.groupChatName;
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
