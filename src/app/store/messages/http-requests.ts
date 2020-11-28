import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import { Message, MessagesReqData, MessageCreationReqData, UserMessageTypingRequest, EditMessageApiReq, DeleteMessagesApiReq } from './models';
import { ApiBasePath } from '../root-api';

export const MessagesHttpRequests = {
  getMessages: httpRequestFactory<AxiosResponse<Message[]>, MessagesReqData>(`${ApiBasePath.MainApi}/api/messages/search`, HttpRequestMethod.Post),
  createMessage: httpRequestFactory<AxiosResponse<number>, MessageCreationReqData>(`${ApiBasePath.MainApi}/api/messages`, HttpRequestMethod.Post),
  messageTyping: httpRequestFactory<AxiosResponse, UserMessageTypingRequest>(
    `${ApiBasePath.NotificationsApi}/api/message/notify-interlocutor-about-message-typing`,
    HttpRequestMethod.Post,
  ),
  editMessage: httpRequestFactory<AxiosResponse, EditMessageApiReq>(`${ApiBasePath.MainApi}/api/messages`, HttpRequestMethod.Put),
  deleteMessage: httpRequestFactory<AxiosResponse, DeleteMessagesApiReq>(`${ApiBasePath.MainApi}/api/messages/delete-message-list`, HttpRequestMethod.Post),
};
