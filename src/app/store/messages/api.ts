import {
  MarkMessagesAsReadRequest,
  MessageCreationReqData,
  MessagesReqData,
  UserMessageTypingRequest
} from './interfaces';
import { api, ENDPOINTS, notifications } from 'app/api';

export const getMessagesApi = (data: MessagesReqData) => api.post(ENDPOINTS.GET_MESSAGES, data);

export const createMessageApi = (data: MessageCreationReqData) => api.post(ENDPOINTS.CREATE_MESSAGE, data);

export const markMessagesAsReadApi = (data: MarkMessagesAsReadRequest) =>
  api.post(ENDPOINTS.MARK_MESSAGES_AS_READ, data);

export const messageTypingApi = (data: UserMessageTypingRequest) => notifications.post(ENDPOINTS.MESSAGE_TYPING, data);
