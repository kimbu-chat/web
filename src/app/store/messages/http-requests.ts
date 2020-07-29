import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '../common/http-factory';
import { Message, MessagesReqData, MessageCreationReqData, MarkMessagesAsReadRequest, UserMessageTypingRequest } from './models';
import { ApiBasePath } from '../root-api';

export const MessagesHttpRequests = {
	getMessages: httpRequestFactory<AxiosResponse<Message[]>, MessagesReqData>(
		`${ApiBasePath.MainApi}/api/messages/search`,
		HttpRequestMethod.Post,
	),
	createMessage: httpRequestFactory<AxiosResponse<number>, MessageCreationReqData>(
		`${ApiBasePath.MainApi}/api/messages`,
		HttpRequestMethod.Post,
	),
	markMessagesAsRead: httpRequestFactory<AxiosResponse, MarkMessagesAsReadRequest>(
		`${ApiBasePath.MainApi}/api/dialogsConferences/markAsRead`,
		HttpRequestMethod.Post,
	),
	messageTyping: httpRequestFactory<AxiosResponse, UserMessageTypingRequest>(
		`${ApiBasePath.NotificationsApi}/api/message/notify-interlocutor-about-message-typing`,
		HttpRequestMethod.Post,
	),
};
