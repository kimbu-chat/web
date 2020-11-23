import { getSelectedChatIdSelector } from './../chats/selectors';
import { call, put, takeLatest, takeEvery, select, throttle } from 'redux-saga/effects';
import { RootState } from 'app/store/root-reducer';

import {
	CreateMessageRequest,
	MessageCreationReqData,
	MessageState,
	SystemMessageType,
	MessagesReqData,
	MessageList,
	EditMessageApiReq,
} from './models';

import { ChatId } from '../chats/chat-id';
import { MessageActions } from './actions';
import { MessagesHttpRequests } from './http-requests';
import { SagaIterator } from 'redux-saga';
import moment from 'moment';

import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { Chat, MarkMessagesAsReadRequest } from '../chats/models';
import { ChatHttpRequests } from '../chats/http-requests';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { ChatActions } from '../chats/actions';

const audioSelected = new Audio(messageCameSelected);
const audioUnselected = new Audio(messageCameUnselected);

export function* getMessages(action: ReturnType<typeof MessageActions.getMessages>): SagaIterator {
	const { page, chat } = action.payload;

	const request: MessagesReqData = {
		page: page,
		chatId: new ChatId().From(chat.interlocutor?.id!, chat.groupChat?.id!).entireId,
	};

	const httpRequest = MessagesHttpRequests.getMessages;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(request)));

	data.forEach((message) => {
		message.state =
			chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= message.id
				? MessageState.READ
				: MessageState.SENT;
	});
	let messageList: MessageList = {
		chatId: chat.id,
		messages: data,
		hasMoreMessages: data.length >= page.limit,
	};

	yield put(MessageActions.getMessagesSuccess(messageList));
}

export function* createMessage(action: ReturnType<typeof MessageActions.createMessage>): SagaIterator {
	let { message, chatId, isFromEvent } = action.payload;
	const selectedChatId = yield select(getSelectedChatIdSelector);

	if (isFromEvent) {
		if (selectedChatId === chatId) {
			yield call(notifyInterlocutorThatMessageWasRead, action.payload);
		}
		//notifications play
		const currentUserId = yield select((state: RootState) => state.myProfile.user?.id);
		const chatOfMessage = yield select((state: RootState) => state.chats.chats.find(({ id }) => id === chatId));
		const isAudioPlayAllowed = yield select((state: RootState) => state.settings.notificationSound);
		const chats: Chat[] = yield select((state: RootState) => state.chats.chats);

		if (isAudioPlayAllowed) {
			if (
				message.userCreator?.id !== currentUserId &&
				!(selectedChatId !== message.chatId) &&
				!document.hidden &&
				!chatOfMessage.isMuted
			) {
				audioSelected.play();
			}

			if ((selectedChatId !== message.chatId || document.hidden) && !chatOfMessage.isMuted) {
				audioUnselected.play();
			}
		}

		if (chats.findIndex(({ id }) => id === chatId) === -1) {
			const httpRequest = ChatHttpRequests.getChatById;

			const { data, status } = httpRequest.call(yield call(() => httpRequest.generator({ chatId })));

			if (status === HTTPStatusCode.OK) {
				yield put(ChatActions.unshiftChat(data));
			} else {
				alert('getChatInfoSaga error');
			}
		}
	} else {
		const attachmentsToSend = message.attachments?.map(({ id, type }) => ({ id, type })) || [];
		try {
			const messageCreationReq: MessageCreationReqData = {
				text: message.text,
				chatId,
				attachments: attachmentsToSend,
			};

			const httpRequest = MessagesHttpRequests.createMessage;
			const { data } = httpRequest.call(yield call(() => httpRequest.generator(messageCreationReq)));

			yield put(
				MessageActions.createMessageSuccess({
					chatId: message.chatId || 0,
					oldMessageId: message.id,
					newMessageId: data,
					messageState: MessageState.SENT,
					attachments: message.attachments,
				}),
			);
		} catch {
			alert('error message create');
		}
	}
}

export function* messageTyping({ payload }: ReturnType<typeof MessageActions.messageTyping>): SagaIterator {
	const httpRequest = MessagesHttpRequests.messageTyping;
	httpRequest.call(yield call(() => httpRequest.generator(payload)));
}

export function* notifyInterlocutorThatMessageWasRead(createMessageRequest: CreateMessageRequest): SagaIterator {
	const { chatId, message } = createMessageRequest;
	const selectedChatId = yield select(getSelectedChatIdSelector);
	const currentUserId = yield select((state: RootState) => state.myProfile.user?.id);

	if (
		!selectedChatId ||
		!Boolean(message.userCreator) ||
		currentUserId === message.userCreator?.id ||
		message.systemMessageType !== SystemMessageType.None
	) {
		return;
	}
	const isChatCurrentInterlocutor: boolean = chatId == selectedChatId;
	if (isChatCurrentInterlocutor) {
		const httpRequestPayload: MarkMessagesAsReadRequest = {
			chatId: selectedChatId,
			lastReadMessageId: message.id,
		};
		const httpRequest = ChatHttpRequests.markMessagesAsRead;
		httpRequest.call(yield call(() => httpRequest.generator(httpRequestPayload)));
	} else {
		console.warn('notifyInterlocutorThatMessageWasRead Error');
	}
}

export function* copyMessagesSaga(action: ReturnType<typeof MessageActions.copyMessages>): SagaIterator {
	const chat: MessageList = yield select((state: RootState) =>
		state.messages.messages.find(({ chatId }) => chatId === action.payload.chatId),
	);

	const content = chat.messages.reduce((accum: string, current) => {
		if (action.payload.messageIds.includes(current.id)) {
			const preparedStr = `\n[${moment.utc(current?.creationDateTime).format('YYYY MM DD h:mm')}] ${
				current?.userCreator?.nickname
			}: ${current?.text}`;
			return accum + preparedStr;
		}
		return accum;
	}, '');

	const el = document.createElement('textarea');
	el.value = content;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

export function* editMessageSaga(action: ReturnType<typeof MessageActions.submitEditMessage>): SagaIterator {
	const httpRequest = MessagesHttpRequests.editMessage;
	const editRequest: EditMessageApiReq = {
		text: action.payload.text,
		messageId: action.payload.messageId,
		removedAttachments: action.payload.removedAttachments,
		newAttachments: action.payload.newAttachments,
	};

	const { status } = httpRequest.call(yield call(() => httpRequest.generator(editRequest)));

	if (status === HTTPStatusCode.OK) {
		yield put(MessageActions.submitEditMessageSuccess(action.payload));
	} else {
		alert('editMessageSaga error');
	}
}

export const MessageSagas = [
	throttle(1500, MessageActions.messageTyping, messageTyping),
	takeLatest(MessageActions.getMessages, getMessages),
	takeEvery(MessageActions.createMessage, createMessage),
	takeEvery(MessageActions.copyMessages, copyMessagesSaga),
	takeEvery(MessageActions.submitEditMessage, editMessageSaga),
];
