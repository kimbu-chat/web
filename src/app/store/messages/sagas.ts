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
import { InterlocutorType } from '../chats/models';
import { MessagesHttpRequests } from './http-requests';
import { SagaIterator } from 'redux-saga';
import moment from 'moment';

export function* getMessages(action: ReturnType<typeof MessageActions.getMessages>): SagaIterator {
	const { page, chat } = action.payload;
	const isConference: boolean = Boolean(chat.conference);

	const request: MessagesReqData = {
		page: page,
		dialog: {
			id: isConference ? chat.conference?.id : chat.interlocutor?.id,
			type: isConference ? 'Conference' : 'User',
		},
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

	const { interlocutorId, interlocutorType } = ChatService.parseChatId(chat.id);
	if (isFromEvent) {
		yield call(notifyInterlocutorThatMessageWasRead, action.payload);
		//notifications play
		const currentUserId = yield select((state: RootState) => state.myProfile.user?.id);
		const chatOfMessage = yield select((state: RootState) => state.chats.chats.find(({ id }) => id === chat.id));

		if (
			message.userCreator?.id !== currentUserId &&
			!(selectedChatId !== message.chatId) &&
			!document.hidden &&
			!chatOfMessage.isMuted
		) {
			const messageCameSelected = yield call(
				async () => await import('app/assets/sounds/notifications/messsage-came-selected.ogg'),
			);

			const audioSelected = new Audio(messageCameSelected);

			audioSelected.play();
		}

		if ((selectedChatId !== message.chatId || document.hidden) && !chatOfMessage.isMuted) {
			const messageCameUnselected = yield call(
				async () => await import('app/assets/sounds/notifications/messsage-came-unselected.ogg'),
			);

			const audioUnselected = new Audio(messageCameUnselected);

			audioUnselected.play();
		}
	} else {
		try {
			const messageCreationReq: MessageCreationReqData = {
				text: message.text,
				conferenceId: interlocutorType === InterlocutorType.CONFERENCE ? interlocutorId : null,
				userInterlocutorId: interlocutorType === InterlocutorType.USER ? interlocutorId : null,
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
	const isDestinationTypeUser: boolean = chat.interlocutorType === InterlocutorType.USER;

	const isChatCurrentInterlocutor: boolean = chat.id == selectedChatId;
	if (isChatCurrentInterlocutor) {
		const httpRequestPayload = {
			dialog: {
				conferenceId: isDestinationTypeUser ? null : chat.conference?.id!,
				interlocutorId: isDestinationTypeUser ? message.userCreator?.id! : null,
			},
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
		dialog: {
			conferenceId: action.payload.conference?.id || null,
			interlocutorId: action.payload.interlocutor?.id || null,
		},
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
