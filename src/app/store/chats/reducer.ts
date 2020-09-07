import { Chat } from './models';
import produce from 'immer';
import { ChatService } from './chat-service';
import { CreateMessageResponse } from '../messages/models';
import { InterlocutorType } from './models';
import { createReducer } from 'typesafe-actions';
import { ChatActions } from './actions';
import { MessageActions } from '../messages/actions';
import { FriendActions } from '../friends/actions';

export interface ChatsState {
	loading: boolean;
	hasMore: boolean;
	searchString: string;
	chats: Chat[];
	selectedChatId?: number | null;
}

const initialState: ChatsState = {
	loading: false,
	hasMore: true,
	searchString: '',
	chats: [],
	selectedChatId: null,
};

const checkChatExists = (chatId: number, state: ChatsState): boolean =>
	Boolean(state.chats.find(({ id }) => id === chatId));

const getChatArrayIndex = (chatId: number, state: ChatsState): number =>
	state.chats.findIndex(({ id }) => id === chatId);

const chats = createReducer<ChatsState>(initialState)
	.handleAction(
		ChatActions.interlocutorStoppedTyping,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.interlocutorStoppedTyping>) => {
			const { isConference, interlocutorId, objectId } = payload;

			const chatId: number = ChatService.getChatIdentifier(
				!isConference ? objectId : null,
				isConference ? interlocutorId : null,
			);

			const isChatExists: boolean = checkChatExists(chatId, draft);

			if (!isChatExists) {
				return draft;
			}

			const chatIndex: number = getChatArrayIndex(chatId, draft);

			(draft.chats[chatIndex].timeoutId = undefined), (draft.chats[chatIndex].isInterlocutorTyping = false);

			return draft;
		}),
	)
	.handleAction(
		ChatActions.interlocutorMessageTyping,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.interlocutorMessageTyping>) => {
			const { isConference, interlocutorId, objectId } = payload;

			const chatId: number = ChatService.getChatIdentifier(
				!isConference ? objectId : null,
				isConference ? interlocutorId : null,
			);

			const isChatExists: boolean = checkChatExists(chatId, draft);

			if (!isChatExists) {
				return draft;
			}

			const chatIndex: number = getChatArrayIndex(chatId, draft);

			clearTimeout(draft.chats[chatIndex].timeoutId as NodeJS.Timeout);

			(draft.chats[chatIndex].draftMessage = payload.text),
				(draft.chats[chatIndex].timeoutId = payload.timeoutId),
				(draft.chats[chatIndex].isInterlocutorTyping = true);

			return draft;
		}),
	)
	.handleAction(
		MessageActions.createMessageSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createMessageSuccess>) => {
			const { chatId, newMessageId }: CreateMessageResponse = payload;

			const chatIndex: number = getChatArrayIndex(chatId, draft);

			const lastMessage = draft.chats[chatIndex].lastMessage || { id: 0 };

			lastMessage.id = newMessageId;

			return draft;
		}),
	)
	.handleAction(
		ChatActions.createConferenceSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.createConferenceSuccess>) => {
			const newChat = payload;

			const isChatExists: boolean = checkChatExists(newChat.id, draft);

			if (!isChatExists) {
				draft.chats.unshift(newChat);
				return draft;
			}

			return draft;
		}),
	)
	.handleAction(
		ChatActions.addUsersToConferenceSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.addUsersToConferenceSuccess>) => {
			const { id } = payload;

			const chatIndex: number = getChatArrayIndex(id, draft);

			const conference = draft.chats[chatIndex].conference || { membersCount: 0 };

			conference.membersCount = (conference.membersCount || 0) + 1;

			return draft;
		}),
	)
	.handleAction(
		ChatActions.muteChatSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.muteChatSuccess>) => {
			const { id } = payload;

			const chatIndex: number = getChatArrayIndex(id, draft);

			draft.chats[chatIndex].isMuted = !draft.chats[chatIndex].isMuted;

			return draft;
		}),
	)
	.handleAction(
		ChatActions.renameConferenceSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.renameConferenceSuccess>) => {
			const { chat, newName } = payload;
			const { id } = chat;

			const chatIndex: number = getChatArrayIndex(id, draft);

			const conference = draft.chats[chatIndex].conference || { name: '' };

			conference.name = newName;
			return draft;
		}),
	)
	.handleAction(
		ChatActions.changeSelectedChat,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.changeSelectedChat>) => {
			draft.chats.sort(({ lastMessage: lastMessageA }, { lastMessage: lastMessageB }) => {
				return (
					new Date(lastMessageB?.creationDateTime!).getTime() -
					new Date(lastMessageA?.creationDateTime!).getTime()
				);
			});

			draft.selectedChatId = payload;

			return draft;
		}),
	)
	.handleAction(
		ChatActions.unsetSelectedChat,
		produce((draft: ChatsState) => {
			return {
				...draft,
				selectedChatId: null,
			};
		}),
	)
	.handleAction(
		ChatActions.getChats,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getChats>) => {
			return {
				...draft,
				loading: true,
				searchString: payload.name || '',
			};
		}),
	)
	.handleAction(
		ChatActions.getChatsSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getChatsSuccess>) => {
			const { chats, hasMore, initializedBySearch } = payload;

			(draft.loading = false), (draft.hasMore = hasMore);

			if (initializedBySearch) {
				draft.chats = chats;
			} else {
				draft.chats = draft.chats.concat(chats);
			}

			return draft;
		}),
	)
	.handleAction(
		ChatActions.getChatsFailure,
		produce((draft: ChatsState) => {
			return {
				...draft,
				loading: false,
			};
		}),
	)
	.handleAction(
		[ChatActions.leaveConferenceSuccess, ChatActions.removeChatSuccess],
		produce(
			(
				draft: ChatsState,
				{
					payload,
				}:
					| ReturnType<typeof ChatActions.leaveConferenceSuccess>
					| ReturnType<typeof ChatActions.removeChatSuccess>,
			) => {
				const chatIndex: number = getChatArrayIndex(payload.id, draft);
				draft.chats.splice(chatIndex, 1);
				draft.selectedChatId = null;
				return draft;
			},
		),
	)
	.handleAction(
		MessageActions.markMessagesAsRead,
		produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.markMessagesAsRead>) => {
			const chatId = payload.id;
			const chatIndex: number = getChatArrayIndex(chatId, draft);
			draft.chats[chatIndex].ownUnreadMessagesCount = 0;
			return draft;
		}),
	)
	.handleAction(
		MessageActions.createMessage,
		produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createMessage>) => {
			const { message, chat, currentUser } = payload;

			const chatId: number = chat.id;

			const isChatExists: boolean = checkChatExists(chatId, draft);

			const chatIndex: number = getChatArrayIndex(chatId, draft);

			const isCurrentUserMessageCreator: boolean = currentUser.id === message.userCreator?.id;

			// if user already has chats with interlocutor - update chat
			if (isChatExists) {
				const isInterlocutorCurrentSelectedChat: boolean = draft.selectedChatId === chatId;
				const previousOwnUnreadMessagesCount = draft.chats[chatIndex].ownUnreadMessagesCount || 0;
				let ownUnreadMessagesCount =
					isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator
						? previousOwnUnreadMessagesCount
						: previousOwnUnreadMessagesCount + 1;

				(draft.chats[chatIndex].lastMessage = { ...message }),
					(draft.chats[chatIndex].ownUnreadMessagesCount = ownUnreadMessagesCount);

				const chatWithNewMessage = draft.chats[chatIndex];

				draft.chats.splice(chatIndex, 1);

				draft.chats.unshift(chatWithNewMessage);

				return draft;
			} else {
				//if user does not have chat with interlocutor - create chat
				const interlocutorType: InterlocutorType = ChatService.getInterlocutorType(payload.chat);
				let newChat: Chat = {
					id: chat.id,
					interlocutorType: interlocutorType,
					conference: chat.conference,
					lastMessage: message,
					ownUnreadMessagesCount: !isCurrentUserMessageCreator ? 1 : 0,
					interlocutorLastReadMessageId: 0,
					interlocutor: chat.interlocutor,
				};

				draft.chats.unshift(newChat);

				return draft;
			}
		}),
	)
	.handleAction(
		ChatActions.changeConferenceAvatarSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.changeConferenceAvatarSuccess>) => {
			const { conferenceId, croppedAvatarUrl } = payload;

			const chatId: number = ChatService.getChatIdentifier(null, conferenceId);

			const chatIndex: number = getChatArrayIndex(chatId, draft);

			const conference = draft.chats[chatIndex].conference || { avatarUrl: '' };

			conference.avatarUrl = croppedAvatarUrl;

			return draft;
		}),
	)
	.handleAction(
		FriendActions.userStatusChangedEvent,
		produce((draft: ChatsState, { payload }: ReturnType<typeof FriendActions.userStatusChangedEvent>) => {
			const { status, objectId } = payload;
			const chatId: number = ChatService.getChatId(objectId, null);
			const isChatExists = checkChatExists(chatId, draft);
			const chatIndex = getChatArrayIndex(chatId, draft);

			if (!isChatExists) {
				return draft;
			}

			const interlocutor = draft.chats[chatIndex].interlocutor!;
			(interlocutor.status = status), (interlocutor.lastOnlineTime = new Date());

			return draft;
		}),
	)
	.handleAction(
		MessageActions.createChat,
		produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createChat>) => {
			const { id } = payload;

			const chatId: number = ChatService.getChatId(id, null);

			const isChatExists = checkChatExists(chatId, draft);

			draft.selectedChatId = chatId;

			if (isChatExists) {
				return draft;
			} else {
				//user does not have chat with interlocutor - create chat
				let newChat: Chat = {
					id: chatId,
					interlocutorType: 1,
					conference: null,
					lastMessage: null,
					ownUnreadMessagesCount: 0,
					interlocutorLastReadMessageId: 0,
					interlocutor: payload,
				};

				draft.chats.unshift(newChat);

				return draft;
			}
		}),
	)
	.handleAction(
		ChatActions.changeInterlocutorLastReadMessageId,
		produce(
			(draft: ChatsState, { payload }: ReturnType<typeof ChatActions.changeInterlocutorLastReadMessageId>) => {
				const { lastReadMessageId, userReaderId } = payload;

				const chatId = ChatService.getChatId(userReaderId, null);
				const chatIndex = getChatArrayIndex(chatId, draft);

				if (chatIndex >= 0) {
					draft.chats[chatIndex].interlocutorLastReadMessageId = lastReadMessageId;
				}

				return draft;
			},
		),
	);

export default chats;
