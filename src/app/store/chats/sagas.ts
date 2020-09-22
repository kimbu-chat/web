import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { Chat, MuteChatRequest, GetChatsResponse, HideChatRequest, InterlocutorType } from './models';
import { MessageState, SystemMessageType, Message, CreateMessageRequest } from '../messages/models';
import { ChatService } from './chat-service';
import { ChatActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { FileUploadRequest, ErrorUploadResponse, uploadFileSaga } from 'app/utils/file-uploader/file-uploader';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { ConferenceCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/conference-сreated-integration-event';
import { MessageActions } from '../messages/actions';
import { ChatHttpRequests } from './http-requests';
import { UpdateAvatarResponse } from '../common/models';
import { FriendActions } from '../friends/actions';
import { MyProfileService } from 'app/services/my-profile-service';
import { getType } from 'typesafe-actions';
import { MessageUtils } from 'app/utils/message-utils';

export function* getChatsSaga(action: ReturnType<typeof ChatActions.getChats>): SagaIterator {
	const chatsRequestData = action.payload;

	const { name, showOnlyHidden, page, showAll } = action.payload;

	const request = { name, showOnlyHidden, page, showAll };

	const getChatsRequest = ChatHttpRequests.getChats;
	const { data }: AxiosResponse<Chat[]> = getChatsRequest.call(yield call(() => getChatsRequest.generator(request)));
	data.forEach((chat: Chat) => {
		const lastMessage = chat.lastMessage || { state: {} };

		lastMessage.state =
			chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= Number(chat?.lastMessage?.id)
				? (MessageState.READ as MessageState)
				: (MessageState.SENT as MessageState);
		chat.interlocutorType = ChatService.getInterlocutorType(chat);
		chat.id = ChatService.getChatIdentifier(chat.interlocutor?.id, chat.conference?.id);
	});

	const chatList: GetChatsResponse = {
		chats: data,
		hasMore: data.length >= action.payload.page.limit,
		initializedBySearch: chatsRequestData.initializedBySearch,
	};

	yield put(ChatActions.getChatsSuccess(chatList));
}

export function* muteChatSaga(action: ReturnType<typeof ChatActions.muteChat>) {
	try {
		const chat: Chat = action.payload;

		const request: MuteChatRequest = {
			chatIds: [chat.id],
			isMuted: !chat.isMuted,
		};

		const muteChatRequest = ChatHttpRequests.muteChat;
		const { status } = muteChatRequest.call(yield call(() => muteChatRequest.generator(request)));

		if (status === 200) {
			yield put(ChatActions.muteChatSuccess(chat));
		} else {
			alert('Error mute chat');
		}
	} catch (e) {
		console.warn(e);
	}
}

export function* removeChatSaga(action: ReturnType<typeof ChatActions.removeChat>): SagaIterator {
	const chat: Chat = action.payload;
	let response: AxiosResponse;

	try {
		const request: HideChatRequest = {
			chatIds: [chat.id],
			isHidden: true,
		};

		const removeChatRequest = ChatHttpRequests.removeChat;
		response = removeChatRequest.call(yield call(() => removeChatRequest.generator(request)));

		if (response.status === 200) {
			yield put(ChatActions.removeChatSuccess(chat));
		} else {
			alert('Error chat deletion');
		}
	} catch (e) {
		console.warn(e);
	}
}

function* updloadConferenceAvatar(
	action: ReturnType<typeof ChatActions.changeConferenceAvatar> | ReturnType<typeof ChatActions.createConference>,
): SagaIterator {
	const { avatarData, conferenceId } = action.payload;
	if (avatarData && conferenceId) {
		const { imagePath, offsetX, offsetY, width } = avatarData;
		if (!imagePath) {
			return;
		}

		const uploadRequest: FileUploadRequest<UpdateAvatarResponse> = {
			path: imagePath,
			url: 'http://files.ravudi.com/api/conference-avatars/',
			fileName: 'file',
			parameters: {
				'Square.Point.X': offsetX.toString(),
				'Square.Point.Y': offsetY.toString(),
				'Square.Size': width.toString(),
				ConferenceId: conferenceId.toString(),
			},
			errorCallback(response: ErrorUploadResponse): void {
				alert('Error' + response.error);
			},
			*completedCallback(response) {
				yield put(ChatActions.changeConferenceAvatarSuccess({ conferenceId, ...response.data }));
				alert('Upload succes');

				if (action.type === getType(ChatActions.createConference)) {
					action.meta.deferred?.resolve();
				}
			},
		};
		yield call(uploadFileSaga, uploadRequest);
	}
}

function* changeConferenceAvatarSaga(action: ReturnType<typeof ChatActions.changeConferenceAvatar>): SagaIterator {
	yield call(updloadConferenceAvatar, action);
}

function* addUsersToConferenceSaga(action: ReturnType<typeof ChatActions.addUsersToConference>): SagaIterator {
	try {
		const { chat, userIds } = action.payload;
		const httpRequest = ChatHttpRequests.addMembersIntoConference;
		const { status } = httpRequest.call(
			yield call(() =>
				httpRequest.generator({
					conferenceId: chat.conference?.id!,
					userIds: userIds,
				}),
			),
		);

		if (status === HTTPStatusCode.OK) {
			yield put(FriendActions.unsetSelectedUserIdsForNewConference());
			yield put(ChatActions.addUsersToConferenceSuccess(chat));

			action.meta.deferred?.resolve(action.payload.chat);
		} else {
			console.warn('Failed to add users to conference');
		}
	} catch {
		alert('addUsersToConferenceSaga error');
	}
}

function* createConferenceSaga(action: ReturnType<typeof ChatActions.createConference>): SagaIterator {
	const { userIds, name, avatar } = action.payload;

	try {
		const httpRequest = ChatHttpRequests.createConference;
		const { data } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

		const chatId: number = ChatService.getChatIdentifier(undefined, data);
		const chat: Chat = {
			interlocutorType: InterlocutorType.CONFERENCE,
			id: chatId,
			conference: {
				id: data,
				membersCount: userIds.length + 1,
				name: name,
				avatarUrl: undefined,
			},
			lastMessage: {
				creationDateTime: new Date(),
				id: new Date().getTime(),
				systemMessageType: SystemMessageType.ConferenceCreated,
				text: MessageUtils.createSystemMessage({}),
				chatId: chatId,
				state: MessageState.LOCALMESSAGE,
				userCreator: action.payload.currentUser,
			},
		};

		action.payload.conferenceId = data;
		action.payload.avatarData = avatar;

		yield put(FriendActions.unsetSelectedUserIdsForNewConference());
		yield put(ChatActions.createConferenceSuccess(chat));
		yield put(ChatActions.changeSelectedChat(chat.id));
		action.meta.deferred?.resolve(chat);

		if (avatar) {
			yield call(updloadConferenceAvatar, action);
		}
	} catch (e) {
		console.warn(e);
		alert('createConferenceSaga error');
	}
}

function* createConferenceFromEventSaga(
	action: ReturnType<typeof ChatActions.createConferenceFromEvent>,
): SagaIterator {
	const payload: ConferenceCreatedIntegrationEvent = action.payload;
	const chatId: number = ChatService.getChatIdentifier(undefined, payload.objectId);
	const currentUser = new MyProfileService().myProfile;

	const message: Message = {
		systemMessageType: SystemMessageType.ConferenceCreated,
		text: MessageUtils.createSystemMessage({}),
		creationDateTime: new Date(new Date().toUTCString()),
		userCreator: action.payload.userCreator,
		state: MessageState.READ,
		chatId: chatId,
		id: payload.systemMessageId,
	};

	const chat: Chat = {
		interlocutorType: InterlocutorType.CONFERENCE,
		id: chatId,
		conference: {
			id: payload.objectId,
			membersCount: payload.memberIds.length,
			name: action.payload.name,
		},
		lastMessage: message,
	};

	const createMessageRequest: CreateMessageRequest = {
		message: message,
		isFromEvent: true,
		chat: chat,
		currentUser,
		selectedChatId: chat.id,
	};

	yield put(MessageActions.createMessage(createMessageRequest));
}

function* getConferenceUsersSaga(action: ReturnType<typeof ChatActions.getConferenceUsers>): SagaIterator {
	const { initiatedByScrolling } = action.payload;
	const httpRequest = ChatHttpRequests.getConferenceMembers;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));
	yield put(ChatActions.getConferenceUsersSuccess({ users: data, initiatedByScrolling: initiatedByScrolling }));
}

function* leaveConferenceSaga(action: ReturnType<typeof ChatActions.leaveConference>): SagaIterator {
	try {
		const chat: Chat = action.payload;
		const httpRequest = ChatHttpRequests.leaveConferece;
		const { status } = httpRequest.call(yield call(() => httpRequest.generator(chat?.conference?.id)));
		if (status === HTTPStatusCode.OK) {
			yield put(ChatActions.leaveConferenceSuccess(action.payload));
			action.meta.deferred?.resolve();
		} else {
			alert('Error. http status is ' + status);
		}
	} catch {
		alert('leaveConferenceSaga error');
	}
}

function* renameConferenceSaga(action: ReturnType<typeof ChatActions.renameConference>): SagaIterator {
	const { chat, newName } = action.payload;
	const httpRequest = ChatHttpRequests.renameConference;
	const { status } = httpRequest.call(
		yield call(() => httpRequest.generator({ id: chat?.conference?.id!, name: newName })),
	);

	if (status === HTTPStatusCode.OK) {
		yield put(ChatActions.renameConferenceSuccess(action.payload));
	} else {
		alert('renameConferenceSaga error');
	}
}

export const ChatSagas = [
	takeLatest(ChatActions.getChats, getChatsSaga),
	takeLatest(ChatActions.renameConference, renameConferenceSaga),
	takeLatest(ChatActions.leaveConference, leaveConferenceSaga),
	takeLatest(ChatActions.getConferenceUsers, getConferenceUsersSaga),
	takeLatest(ChatActions.createConferenceFromEvent, createConferenceFromEventSaga),
	takeLatest(ChatActions.createConference, createConferenceSaga),
	takeLatest(ChatActions.changeConferenceAvatar, changeConferenceAvatarSaga),
	takeLatest(ChatActions.removeChat, removeChatSaga),
	takeLatest(ChatActions.addUsersToConference, addUsersToConferenceSaga),
	takeLatest(ChatActions.muteChat, muteChatSaga),
];
