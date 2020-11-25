import {
	CreateMessageRequest,
	MessagesReq,
	UserMessageTypingRequest,
	CreateMessageResponse,
	MessageList,
	DeleteMessageReq,
	SelectMessageReq,
	ResetSelectedMessagesReq,
	CopyMessagesReq,
	EditMessageReq,
	ReplyMessageReq,
	SubmitEditMessageReq,
	MessageEdited,
} from './models';
import { createAction } from 'typesafe-actions';
import { createEmptyAction } from '../common/actions';
import { UserPreview } from '../my-profile/models';

export namespace MessageActions {
	export const getMessages = createAction('GET_MESSAGES')<MessagesReq>();
	export const getMessagesSuccess = createAction('GET_MESSAGES_SUCCESS')<MessageList>();
	export const getMessagesFailure = createEmptyAction('GET_MESSAGES_FAILURE');
	export const createMessage = createAction('CREATE_MESSAGE')<CreateMessageRequest>();
	export const createMessageSuccess = createAction('CREATE_MESSAGE_SUCCESS')<CreateMessageResponse>();
	export const messageTyping = createAction('NOTIFY_USER_ABOUT_MESSAGE_TYPING')<UserMessageTypingRequest>();
	export const createChat = createAction('CREATE_DIALOG')<UserPreview>();
	export const deleteMessage = createAction('DELETE_MESSAGE')<DeleteMessageReq>();
	export const deleteMessageSuccess = createAction('DELETE_MESSAGE_SUCCESS')<DeleteMessageReq>();
	export const selectMessage = createAction('SELECT_MESSAGE')<SelectMessageReq>();
	export const resetSelectedMessages = createAction('RESET_SELECTED_MESSAGES')<ResetSelectedMessagesReq>();
	export const copyMessages = createAction('COPY_MESSAGES')<CopyMessagesReq>();
	export const replyToMessage = createAction('REPLY_TO_MESSAGE')<ReplyMessageReq>();
	export const resetReplyToMessage = createEmptyAction('RESET_REPLY_TO_MESSAGE');
	export const editMessage = createAction('EDIT_MESSAGE')<EditMessageReq>();
	export const submitEditMessage = createAction('SUBMIT_EDIT_MESSAGE')<SubmitEditMessageReq>();
	export const submitEditMessageSuccess = createAction('SUBMIT_EDIT_MESSAGE_SUCCESS')<SubmitEditMessageReq>();
	export const messageEdited = createAction('MESSAGE_EDITED')<MessageEdited>();
	export const resetEditMessage = createEmptyAction('RESET_EDIT_MESSAGE');
}
