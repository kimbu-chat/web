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

import { DialogService } from '../dialogs/dialog-service';
import { MessageActions } from './actions';
import { InterlocutorType } from '../dialogs/models';
import { MessagesHttpRequests } from './http-requests';
import { SagaIterator } from 'redux-saga';

//Sounds
import messageCameUnselected from 'app/sounds/notifications/messsage-came-unselected.ogg';
import messageCameSelected from 'app/sounds/notifications/messsage-came-selected.ogg';
import moment from 'moment';

const audioUnselected = new Audio(messageCameUnselected);
const audioSelected = new Audio(messageCameSelected);

export function* getMessages(action: ReturnType<typeof MessageActions.getMessages>): SagaIterator {
	const { page, dialog } = action.payload;
	const isConference: boolean = Boolean(dialog.conference);

	const request: MessagesReqData = {
		page: page,
		dialog: {
			id: isConference ? dialog.conference?.id : dialog.interlocutor?.id,
			type: isConference ? 'Conference' : 'User',
		},
	};

	const httpRequest = MessagesHttpRequests.getMessages;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(request)));

	data.forEach((message) => {
		message.state =
			dialog.interlocutorLastReadMessageId && dialog.interlocutorLastReadMessageId >= message.id
				? MessageState.READ
				: MessageState.SENT;
	});
	let messageList: MessageList = {
		dialogId: dialog.id,
		messages: data,
		hasMoreMessages: data.length >= page.limit,
	};

	yield put(MessageActions.getMessagesSuccess(messageList));
}

export function* createMessage(action: ReturnType<typeof MessageActions.createMessage>): SagaIterator {
	let { message, dialog, isFromEvent, selectedDialogId } = { ...action.payload };

	const { interlocutorId, interlocutorType } = DialogService.parseDialogId(dialog.id);
	if (isFromEvent) {
		yield call(notifyInterlocutorThatMessageWasRead, action.payload);
		//notifications play
		const currentUserId = yield select((state: RootState) => state.myProfile.user?.id);
		const dialogOfMessage = yield select((state: RootState) =>
			state.dialogs.dialogs.find(({ id }) => id === dialog.id),
		);

		if (
			message.userCreator?.id !== currentUserId &&
			!(selectedDialogId !== message.dialogId) &&
			!document.hidden &&
			!dialogOfMessage.isMuted
		) {
			audioSelected.play();
		}

		if ((selectedDialogId !== message.dialogId || document.hidden) && !dialogOfMessage.isMuted) {
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
					dialogId: message.dialogId || 0,
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
	const { dialog, currentUser, selectedDialogId, message } = createMessageRequest;

	if (
		!selectedDialogId ||
		!Boolean(message.userCreator) ||
		currentUser.id === message.userCreator?.id ||
		message.systemMessageType !== SystemMessageType.None
	) {
		return;
	}
	const isDestinationTypeUser: boolean = dialog.interlocutorType === InterlocutorType.USER;

	const isDialogCurrentInterlocutor: boolean = dialog.id == selectedDialogId;
	if (isDialogCurrentInterlocutor) {
		const httpRequestPayload = {
			dialog: {
				conferenceId: isDestinationTypeUser ? null : dialog.conference?.id!,
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
		state.messages.messages.find(({ dialogId }) => dialogId === action.payload.dialogId),
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

	// const content = action.payload.messageIds.reduce((accum: string, current: number) => {
	// 	const message = chat.messages.find(({ id }) => id === current);

	// 	const preparedStr = `\n[${moment.utc(message?.creationDateTime).format('YYYY MM DD h:mm')}] ${
	// 		message?.userCreator?.nickname
	// 	}: ${message?.text}`;
	// 	console.log(preparedStr);

	// 	return accum + preparedStr;
	// }, '');

	const el = document.createElement('textarea');
	el.value = content;
	document.body.appendChild(el);
	el.select();
	console.log('copied ' + content);
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
