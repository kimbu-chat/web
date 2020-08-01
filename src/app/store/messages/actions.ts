import {
	CreateMessageRequest,
	MessagesReq,
	UserMessageTypingRequest,
	CreateMessageResponse,
	MessageList,
} from './models';
import { createAction } from 'typesafe-actions';
import { createEmptyAction } from '../common/actions';
import { Dialog } from '../dialogs/models';
import { UserPreview } from '../my-profile/models';

export namespace MessageActions {
	export const getMessages = createAction('GET_MESSAGES')<MessagesReq>();
	export const getMessagesSuccess = createAction('GET_MESSAGES_SUCCESS')<MessageList>();
	export const getMessagesFailure = createEmptyAction('GET_MESSAGES_FAILURE');
	export const createMessage = createAction('CREATE_MESSAGE')<CreateMessageRequest>();
	export const createMessageSuccess = createAction('CREATE_MESSAGE_SUCCESS')<CreateMessageResponse>();
	export const messageTyping = createAction('NOTIFY_USER_ABOUT_MESSAGE_TYPING')<UserMessageTypingRequest>();
	export const markMessagesAsRead = createAction('RESET_UNREAD_MESSAGES_COUNT')<Dialog>();
	export const createDialog = createAction('CREATE_DIALOG')<UserPreview>();
}
