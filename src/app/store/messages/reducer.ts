import { MessageList, MessageState, Message } from './models';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { MessageActions } from './actions';
import { ChatActions } from '../chats/actions';
import { ChatService } from '../chats/chat-service';
import unionBy from 'lodash/unionBy';
import { MessageUtils } from 'app/utils/message-utils';

export interface MessagesState {
	loading: boolean;
	messages: MessageList[];
	selectedMessageIds: number[];
	messageToReply?: Message;
	messageToEdit?: Message;
}

const initialState: MessagesState = {
	loading: false,
	messages: [],
	selectedMessageIds: [],
};

const checkIfChatExists = (state: MessagesState, chatId: number): boolean =>
	state.messages && state.messages.length > 0 && state?.messages?.findIndex((x) => x.chatId === chatId) > -1;
const getChatIndex = (state: MessagesState, chatId: number): number =>
	state?.messages?.findIndex((x) => x.chatId === chatId);

const getMessage = (messages: Message[], messageId: number) => messages.find(({ id }) => id === messageId);

const messages = createReducer<MessagesState>(initialState)
	.handleAction(
		MessageActions.createMessageSuccess,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.createMessageSuccess>) => {
			const { messageState, chatId, oldMessageId, newMessageId } = payload;
			const chatIndex = getChatIndex(draft, chatId);
			const messageIndex = draft.messages[chatIndex].messages.findIndex((x) => x.id == oldMessageId);
			draft.messages[chatIndex].messages[messageIndex].id = newMessageId;
			draft.messages[chatIndex].messages[messageIndex].state = messageState;

			return draft;
		}),
	)
	.handleAction(
		MessageActions.getMessages,
		produce((draft: MessagesState) => {
			draft.loading = true;
			return draft;
		}),
	)
	.handleAction(
		MessageActions.getMessagesSuccess,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.getMessagesSuccess>) => {
			const { chatId, hasMoreMessages, messages }: MessageList = payload;
			const isChatExists = checkIfChatExists(draft, chatId);

			draft.loading = false;
			if (!isChatExists) {
				draft.messages.push({
					chatId: chatId,
					hasMoreMessages: hasMoreMessages,
					messages: MessageUtils.signAndSeparate(messages),
				});
			} else {
				const chatIndex = getChatIndex(draft, chatId);

				draft.messages[chatIndex].hasMoreMessages = hasMoreMessages;

				draft.messages[chatIndex].messages = MessageUtils.signAndSeparate(
					unionBy(draft.messages[chatIndex].messages, messages, 'id'),
				);
			}

			return draft;
		}),
	)
	.handleAction(
		MessageActions.getMessagesFailure,
		produce((draft: MessagesState) => {
			draft.loading = false;
			return draft;
		}),
	)
	.handleAction(
		MessageActions.createMessage,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.createMessage>) => {
			const { chat, message } = payload;
			const chatIndex = getChatIndex(draft, chat.id);

			if (chatIndex === -1) {
				const messageList: MessageList = {
					chatId: chat.id,
					messages: [message],
					hasMoreMessages: false,
				};
				draft.messages.unshift(messageList);

				return draft;
			}

			draft.messages[chatIndex].messages.unshift(message);

			draft.messages[chatIndex].messages = MessageUtils.signAndSeparate(draft.messages[chatIndex].messages);
			return draft;
		}),
	)
	.handleAction(
		ChatActions.changeInterlocutorLastReadMessageId,
		produce(
			(draft: MessagesState, { payload }: ReturnType<typeof ChatActions.changeInterlocutorLastReadMessageId>) => {
				const { lastReadMessageId, userReaderId } = payload;

				const chatId = ChatService.getChatId(userReaderId, undefined);

				const chatIndex = getChatIndex(draft, chatId);

				if (chatIndex !== -1) {
					draft.messages[chatIndex].messages.map((message) => {
						if (message.id <= lastReadMessageId) message.state = MessageState.READ;
					});
				}

				return draft;
			},
		),
	)
	.handleAction(
		MessageActions.deleteMessageSuccess,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.deleteMessageSuccess>) => {
			const chatIndex = getChatIndex(draft, payload.chatId);

			payload.messageIds.forEach((msgIdToDelete) => {
				if (getMessage(draft.messages[chatIndex].messages, msgIdToDelete)?.isSelected) {
					draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== msgIdToDelete);
				}

				draft.messages[chatIndex].messages = draft.messages[chatIndex].messages.filter(
					({ id }) => id !== msgIdToDelete,
				);
			});
			return draft;
		}),
	)
	.handleAction(
		MessageActions.selectMessage,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.selectMessage>) => {
			const chatIndex = getChatIndex(draft, payload.chatId as number);
			const selectedMessage = draft.messages[chatIndex].messages.find(
				({ id }) => id === payload.messageId,
			) as Message;
			const isMessageSelected =
				draft.selectedMessageIds.includes(selectedMessage?.id as number) && selectedMessage?.isSelected;

			if (!isMessageSelected) {
				selectedMessage.isSelected = true;
				draft.selectedMessageIds.push(payload.messageId);
			} else {
				selectedMessage.isSelected = false;
				draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== payload.messageId);
			}

			return draft;
		}),
	)
	.handleAction(
		MessageActions.resetSelectedMessages,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.resetSelectedMessages>) => {
			const chatIndex = getChatIndex(draft, payload.chatId as number);

			draft.messages[chatIndex].messages.forEach((message) => {
				message.isSelected = false;
			});
			draft.selectedMessageIds = [];

			return draft;
		}),
	)
	.handleAction(
		ChatActions.changeSelectedChat,
		produce((draft: MessagesState) => {
			draft.messages = draft.messages.map((messages) => {
				messages.messages.map((message) => {
					message.isSelected = false;
					return message;
				});

				return messages;
			});

			draft.selectedMessageIds = [];

			return draft;
		}),
	)
	.handleAction(
		MessageActions.replyToMessage,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.replyToMessage>) => {
			draft.selectedMessageIds = [];

			const chatIndex = getChatIndex(draft, payload.chatId);

			const message = getMessage(draft.messages[chatIndex].messages, payload.messageId);

			message!.isSelected = false;

			draft.messageToReply = message;

			return draft;
		}),
	)
	.handleAction(
		MessageActions.editMessage,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.editMessage>) => {
			const chatIndex = getChatIndex(draft, payload.chatId);

			const message = getMessage(draft.messages[chatIndex].messages, payload.messageId);

			message!.isSelected = false;

			draft.messageToEdit = message;

			return draft;
		}),
	)
	.handleAction(
		MessageActions.resetReplyToMessage,
		produce((draft: MessagesState) => {
			draft.messageToReply = undefined;
			return draft;
		}),
	)
	.handleAction(
		MessageActions.resetEditMessage,
		produce((draft: MessagesState) => {
			draft.messageToEdit = undefined;
			return draft;
		}),
	);

export default messages;
