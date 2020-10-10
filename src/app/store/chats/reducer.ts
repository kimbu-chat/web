import { Chat } from './models';
import produce from 'immer';
import { ChatService } from './chat-service';
import { InterlocutorType } from './models';
import { createReducer } from 'typesafe-actions';
import { ChatActions } from './actions';
import { MessageActions } from '../messages/actions';
import { FriendActions } from '../friends/actions';
import { MessageState } from '../messages/models';

export interface ChatsState {
	loading: boolean;
	hasMore: boolean;
	searchString: string;
	chats: Chat[];
	selectedChatId?: number;
}

const initialState: ChatsState = {
	loading: false,
	hasMore: true,
	searchString: '',
	chats: [],
};

const checkChatExists = (chatId: number, state: ChatsState): boolean =>
	Boolean(state.chats.find(({ id }) => id === chatId));

const getChatArrayIndex = (chatId: number, state: ChatsState): number =>
	state.chats.findIndex(({ id }) => id === chatId);

const chats = createReducer<ChatsState>(initialState)
	.handleAction(
		ChatActions.interlocutorStoppedTyping,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.interlocutorStoppedTyping>) => {
			const { chatId, interlocutorName, objectId } = payload;

			console.log(chatId);

			const chatIdentificator: number = ChatService.getChatIdentifier(
				chatId.interlocutorType === InterlocutorType.USER ? objectId : undefined,
				chatId.interlocutorType === InterlocutorType.CONFERENCE ? chatId.conferenceId : undefined,
			);

			const isChatExists: boolean = checkChatExists(chatIdentificator, draft);

			if (!isChatExists) {
				return draft;
			}

			const chatIndex: number = getChatArrayIndex(chatIdentificator, draft);

			(draft.chats[chatIndex].timeoutId = undefined),
				(draft.chats[chatIndex].typingInterlocutors = draft.chats[chatIndex].typingInterlocutors!.filter(
					(user) => user.fullName !== interlocutorName,
				));

			return draft;
		}),
	)
	.handleAction(
		ChatActions.interlocutorMessageTyping,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.interlocutorMessageTyping>) => {
			const { chatId, interlocutorName, timeoutId, objectId } = payload;

			const chatIdentificator: number = ChatService.getChatIdentifier(
				chatId.interlocutorType === InterlocutorType.USER ? objectId : undefined,
				chatId.interlocutorType === InterlocutorType.CONFERENCE ? chatId.conferenceId : undefined,
			);

			const isChatExists: boolean = checkChatExists(chatIdentificator, draft);

			if (!isChatExists) {
				return draft;
			}

			const chatIndex: number = getChatArrayIndex(chatIdentificator, draft);

			clearTimeout(draft.chats[chatIndex].timeoutId as NodeJS.Timeout);

			const typingUser = {
				timeoutId: timeoutId,
				fullName: interlocutorName,
			};

			(draft.chats[chatIndex].draftMessage = payload.text), (draft.chats[chatIndex].timeoutId = timeoutId);

			if (!draft.chats[chatIndex].typingInterlocutors.find(({ fullName }) => fullName === interlocutorName)) {
				draft.chats[chatIndex].typingInterlocutors = [
					...draft.chats[chatIndex].typingInterlocutors,
					typingUser,
				];
			}

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
				selectedChatId: -1,
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
				draft.selectedChatId = -1;
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

				draft.chats.unshift(newChat);

				return draft;
			}
		}),
	)
	.handleAction(
		ChatActions.changeConferenceAvatarSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.changeConferenceAvatarSuccess>) => {
			const { conferenceId, croppedAvatarUrl } = payload;

			const chatId: number = ChatService.getChatIdentifier(undefined, conferenceId);

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
			const chatId: number = ChatService.getChatId(objectId);
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
		ChatActions.changeInterlocutorLastReadMessageId,
		produce(
			(draft: ChatsState, { payload }: ReturnType<typeof ChatActions.changeInterlocutorLastReadMessageId>) => {
				const { lastReadMessageId, userReaderId, objectType, conferenceId } = payload;

				const chatId = ChatService.getChatId(
					objectType === 'User' ? userReaderId : undefined,
					objectType === 'Conference' ? conferenceId : undefined,
				);

				const chatIndex = getChatArrayIndex(chatId, draft);

				if (chatIndex >= 0) {
					draft.chats[chatIndex].interlocutorLastReadMessageId = lastReadMessageId;

					if (draft.chats[chatIndex].lastMessage?.id === lastReadMessageId) {
						draft.chats[chatIndex].lastMessage!.state = MessageState.READ;
					}
				}

				return draft;
			},
		),
	)
	.handleAction(
		MessageActions.createMessageSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createMessageSuccess>) => {
			const { messageState, chatId, oldMessageId, newMessageId } = payload;

			const chatIndex: number = getChatArrayIndex(chatId, draft);

			if (chatIndex >= 0 && draft.chats[chatIndex].lastMessage?.id === oldMessageId) {
				const lastMessage = draft.chats[chatIndex].lastMessage || { id: 0, state: '' };

				lastMessage.id = newMessageId;

				lastMessage.state = messageState;
			}

			return draft;
		}),
	)
	.handleAction(
		MessageActions.createChat,
		produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createChat>) => {
			const { id } = payload;

			const dialogId: number = ChatService.getChatId(id);

			const isDialogExists = checkChatExists(dialogId, draft);

			draft.selectedChatId = dialogId;

			if (isDialogExists) {
				return draft;
			} else {
				//user does not have dialog with interlocutor - create dialog
				let newDialog: Chat = {
					id: dialogId,
					interlocutorType: 1,
					ownUnreadMessagesCount: 0,
					interlocutorLastReadMessageId: 0,
					interlocutor: payload,
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

				draft.chats.unshift(newDialog);

				return draft;
			}
		}),
	)
	.handleAction(
		ChatActions.getPhotoSuccess,
		produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getPhotoSuccess>) => {
			const { photos, chatId, hasMore } = payload;

			const chatIndex: number = getChatArrayIndex(chatId, draft);

			if (chatIndex >= 0) {
				draft.chats[chatIndex].photos = {
					photos,
					hasMore,
				};
			}
			return draft;
		}),
	);
export default chats;
