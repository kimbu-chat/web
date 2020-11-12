import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { RootState } from 'app/store/root-reducer';

import {
	CreateMessageRequest,
	MessageCreationReqData,
	MessageState,
	SystemMessageType,
	MessagesReqData,
	MessageList,
	MarkMessagesAsReadRequest,
} from './models';

import { ChatService } from '../chats/chat-service';
import { MessageActions } from './actions';
import { MessagesHttpRequests } from './http-requests';
import { SagaIterator } from 'redux-saga';
import moment from 'moment';

import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';

const audioSelected = new Audio(messageCameSelected);
const audioUnselected = new Audio(messageCameUnselected);

export function* getMessages(action: ReturnType<typeof MessageActions.getMessages>): SagaIterator {
	const { page, chat } = action.payload;

	const request: MessagesReqData = {
		page: page,
		chatId: ChatService.getChatId(chat.interlocutor?.id!, chat.conference?.id!),
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
	let { message, chat, isFromEvent, selectedChatId } = { ...action.payload };

	if (isFromEvent) {
		yield call(notifyInterlocutorThatMessageWasRead, action.payload);
		//notifications play
		const currentUserId = yield select((state: RootState) => state.myProfile.user?.id);
		const chatOfMessage = yield select((state: RootState) => state.chats.chats.find(({ id }) => id === chat.id));
		const isAudioPlayAllowed = yield select((state: RootState) => state.settings.notificationSound);

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
	} else {
		console.log(message.attachments);
		//const attachmentsToSend = message.attachments?.map(({ id, type }) => ({ id, type })) || [];
		try {
			const messageCreationReq: MessageCreationReqData = {
				text: message.text,
				chatId: chat.id,
				//attachments: attachmentsToSend,
			};

			const httpRequest = MessagesHttpRequests.createMessage;
			const { data } = httpRequest.call(yield call(() => httpRequest.generator(messageCreationReq)));

			yield put(
				MessageActions.createMessageSuccess({
					chatId: message.chatId || 0,
					oldMessageId: message.id,
					newMessageId: data,
					messageState: MessageState.SENT,
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
	const { chat, currentUser, selectedChatId, message } = createMessageRequest;

	if (
		!selectedChatId ||
		!Boolean(message.userCreator) ||
		currentUser.id === message.userCreator?.id ||
		message.systemMessageType !== SystemMessageType.None
	) {
		return;
	}
	const isChatCurrentInterlocutor: boolean = chat.id == selectedChatId;
	if (isChatCurrentInterlocutor) {
		const httpRequestPayload: MarkMessagesAsReadRequest = {
			chatId: selectedChatId,
		};
		const httpRequest = MessagesHttpRequests.markMessagesAsRead;
		httpRequest.call(yield call(() => httpRequest.generator(httpRequestPayload)));
	} else {
		console.warn('notifyInterlocutorThatMessageWasRead Error');
	}
}

export function* resetUnreadMessagesCountSaga(
	action: ReturnType<typeof MessageActions.markMessagesAsRead>,
): SagaIterator {
	const request: MarkMessagesAsReadRequest = {
		chatId: action.payload.id,
	};

	const httpRequest = MessagesHttpRequests.markMessagesAsRead;
	httpRequest.call(yield call(() => httpRequest.generator(request)));
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

export const MessageSagas = [
	takeLatest(MessageActions.markMessagesAsRead, resetUnreadMessagesCountSaga),
	takeLatest(MessageActions.messageTyping, messageTyping),
	takeLatest(MessageActions.getMessages, getMessages),
	takeEvery(MessageActions.createMessage, createMessage),
	takeEvery(MessageActions.copyMessages, copyMessagesSaga),
];
