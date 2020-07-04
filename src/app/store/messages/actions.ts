import { createAction } from '../utils';

import {
  CreateMessageRequest,
  MessagesReq,
  UserMessageTypingRequest,
  CreateMessageResponse,
  MessageList,
} from './interfaces';

import { Dialog } from '../dialogs/types';

import { MessagesReadIntegrationEvent } from '../middlewares/websockets/integration-events/messages-read-integration-event';
import { MessagesActionTypes } from './types';

export const getMessagesAction = (data: MessagesReq) => createAction(MessagesActionTypes.GET_MESSAGES, data);
export const getMessagesSuccessAction = (messageList: MessageList) =>
  createAction(MessagesActionTypes.GET_MESSAGES_SUCCESS, messageList);
export const getMessagesFailureAction = () => createAction(MessagesActionTypes.GET_MESSAGES_FAILURE);
export const createMessageAction = (data: CreateMessageRequest) => createAction(MessagesActionTypes.CREATE_MESSAGE, data);
export const createMessageSuccessAction = (createMessageResponse: CreateMessageResponse) =>
  createAction(MessagesActionTypes.CREATE_MESSAGE_SUCCESS, createMessageResponse);
export const changeInterlocutorLastReadMessageIdAction = (data: MessagesReadIntegrationEvent) =>
  createAction(MessagesActionTypes.CONFERENCE_MESSAGE_READ_FROM_EVENT, data);
export const messageTypingAction = (data: UserMessageTypingRequest) =>
  createAction(MessagesActionTypes.NOTIFY_USER_ABOUT_MESSAGE_TYPING, data);
export const markMessagesAsReadAction = (dialog: Dialog) => createAction(MessagesActionTypes.RESET_UNREAD_MESSAGES_COUNT, dialog);

export type MessagesActions =
  | typeof getMessagesAction
  | typeof getMessagesSuccessAction
  | typeof getMessagesFailureAction
  | typeof createMessageAction
  | typeof createMessageSuccessAction
  | typeof changeInterlocutorLastReadMessageIdAction
  | typeof messageTypingAction
  | typeof markMessagesAsReadAction;
