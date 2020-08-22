import { MessageList, MessageState, Message } from './models';
import _ from 'lodash';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { MessageActions } from './actions';
import { ChatActions } from '../dialogs/actions';
import { DialogService } from '../dialogs/dialog-service';

export interface MessagesState {
	loading: boolean;
	messages: MessageList[];
	selectedMessageIds: number[];
}

const initialState: MessagesState = {
	loading: false,
	messages: [],
	selectedMessageIds: [],
};

const checkIfDialogExists = (state: MessagesState, dialogId: number): boolean =>
	state.messages && state.messages.length > 0 && state?.messages?.findIndex((x) => x.dialogId === dialogId) > -1;
const getChatIndex = (state: MessagesState, dialogId: number): number =>
	state?.messages?.findIndex((x) => x.dialogId === dialogId);

const getMessage = (messages: Message[], messageId: number) => messages.find(({ id }) => id === messageId);

const messages = createReducer<MessagesState>(initialState)
	.handleAction(
		MessageActions.createMessageSuccess,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.createMessageSuccess>) => {
			const { messageState, dialogId, oldMessageId, newMessageId } = payload;
			const chatIndex = getChatIndex(draft, dialogId);
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
			const { dialogId, hasMoreMessages, messages }: MessageList = payload;
			const isDialogExists = checkIfDialogExists(draft, dialogId);

			draft.loading = false;
			if (!isDialogExists) {
				draft.messages.push({
					dialogId: dialogId,
					hasMoreMessages: hasMoreMessages,
					messages: messages,
				});
			} else {
				const chatIndex = getChatIndex(draft, dialogId);
				draft.messages[chatIndex].messages = _.unionBy(draft.messages[chatIndex].messages, messages, 'id');
				draft.messages[chatIndex].hasMoreMessages = hasMoreMessages;
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
			const { dialog, message } = payload;
			const chatIndex = getChatIndex(draft, dialog.id);

			if (chatIndex === -1) {
				const messageList: MessageList = {
					dialogId: dialog.id,
					messages: [message],
					hasMoreMessages: false,
				};
				draft.messages.unshift(messageList);

				return draft;
			}

			draft.messages[chatIndex].messages.unshift(message);
			return draft;
		}),
	)
	.handleAction(
		ChatActions.changeInterlocutorLastReadMessageId,
		produce(
			(draft: MessagesState, { payload }: ReturnType<typeof ChatActions.changeInterlocutorLastReadMessageId>) => {
				const { lastReadMessageId, userReaderId } = payload;

				const dialogId = DialogService.getDialogId(userReaderId, null);

				const chatIndex = getChatIndex(draft, dialogId);

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
			const chatIndex = getChatIndex(draft, payload.dialogId);

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
			const chatIndex = getChatIndex(draft, payload.dialogId as number);
			const selectedMessage = draft.messages[chatIndex].messages.find(
				({ id }) => id === payload.messageId,
			) as Message;
			const isMessageSelected =
				draft.selectedMessageIds.includes(selectedMessage?.id as number) && selectedMessage?.isSelected;

			if (!isMessageSelected) {
				console.log('message not selected');
				selectedMessage.isSelected = true;
				draft.selectedMessageIds.push(payload.messageId);
			} else {
				console.log('message  selected');
				selectedMessage.isSelected = false;
				draft.selectedMessageIds = draft.selectedMessageIds.filter((id) => id !== payload.messageId);
			}

			return draft;
		}),
	)
	.handleAction(
		MessageActions.resetSelectedMessages,
		produce((draft: MessagesState, { payload }: ReturnType<typeof MessageActions.resetSelectedMessages>) => {
			const chatIndex = getChatIndex(draft, payload.dialogId as number);

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
			return draft;
		}),
	);

export default messages;
