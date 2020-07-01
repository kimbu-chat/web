import {
  GET_MESSAGES,
  GET_MESSAGES_FAILURE,
  GET_MESSAGES_SUCCESS,
  NOTIFY_USER_ABOUT_MESSAGE_TYPING,
  RESET_UNREAD_MESSAGES_COUNT,
  CONFERENCE_MESSAGE_READ_FROM_EVENT,
  CREATE_MESSAGE,
  CREATE_MESSAGE_SUCCESS
} from './types';
import { createAction } from '../utils';

import {
  CreateMessageRequest,
  MessagesReq,
  UserMessageTypingRequest,
  CreateMessageResponse,
  GetMessagesResponse
} from './interfaces';

import { Dialog } from '../dialogs/types';

import { MessagesReadIntegrationEvent } from '../middlewares/websockets/integration-events/messages-read-integration-event';

export const getMessagesAction = (data: MessagesReq) => createAction(GET_MESSAGES, data);
export const getMessagesSuccessAction = (messageList: GetMessagesResponse) =>
  createAction(GET_MESSAGES_SUCCESS, messageList);
export const getMessagesFailureAction = () => createAction(GET_MESSAGES_FAILURE);
export const createMessageAction = (data: CreateMessageRequest) => createAction(CREATE_MESSAGE, data);
export const createMessageSuccessAction = (createMessageResponse: CreateMessageResponse) =>
  createAction(CREATE_MESSAGE_SUCCESS, createMessageResponse);
export const changeInterlocutorLastReadMessageIdAction = (data: MessagesReadIntegrationEvent) =>
  createAction(CONFERENCE_MESSAGE_READ_FROM_EVENT, data);
export const messageTypingAction = (data: UserMessageTypingRequest) =>
  createAction(NOTIFY_USER_ABOUT_MESSAGE_TYPING, data);
export const markMessagesAsReadAction = (dialog: Dialog) => createAction(RESET_UNREAD_MESSAGES_COUNT, dialog);
