import {
  MarkMessagesAsReadRequest,
  MessageCreationReqData,
  MessagesReqData,
  UserMessageTypingRequest
} from './interfaces';
import { api, ENDPOINTS, notifications } from 'app/api';
import { AxiosPromise } from 'axios';

export const getMessagesApi = (data: MessagesReqData) => api.post(ENDPOINTS.GET_MESSAGES, data);

export const createMessageApi = (data: MessageCreationReqData): AxiosPromise<number> => api.post<number>(ENDPOINTS.CREATE_MESSAGE, data);

export const markMessagesAsReadApi = (data: MarkMessagesAsReadRequest) =>
  api.post(ENDPOINTS.MARK_MESSAGES_AS_READ, data);

export const messageTypingApi = (data: UserMessageTypingRequest) => notifications.post(ENDPOINTS.MESSAGE_TYPING, data);
