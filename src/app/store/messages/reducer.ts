import { MessageList, MessageState } from './models';
import _ from 'lodash';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { MessageActions } from './actions';
import { ChatActions } from '../dialogs/actions';
import { DialogService } from '../dialogs/dialog-service';

export interface MessagesState {
	loading: boolean;
	messages: MessageList[];
}

const initialState: MessagesState = {
	loading: false,
	messages: [],
};

const checkIfDialogExists = (state: MessagesState, dialogId: number): boolean =>
	state.messages && state.messages.length > 0 && state?.messages?.findIndex((x) => x.dialogId === dialogId) > -1;
const getChatIndex = (state: MessagesState, dialogId: number): number =>
	state?.messages?.findIndex((x) => x.dialogId === dialogId);

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
			const chatIndex = getChatIndex(draft, payload.dialogId as number);

			draft.messages[chatIndex].messages = draft.messages[chatIndex].messages.filter(
				({ id }) => id !== payload.messageId,
			);

			return draft;
		}),
	);

export default messages;
