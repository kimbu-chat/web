import { RootState } from './../root-reducer';
import { FileType } from 'app/store/messages/models';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import {
	Chat,
	MuteChatRequest,
	GetChatsResponse,
	HideChatRequest,
	InterlocutorType,
	UploadAttachmentSagaProgressData,
	UploadAttachmentSagaStartedData,
	BaseAttachment,
	ConferenceCreationHTTPReqData,
} from './models';
import { MessageState, SystemMessageType, Message, CreateMessageRequest } from '../messages/models';
import { ChatService } from './chat-service';
import { ChatActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { ConferenceCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/conference-сreated-integration-event';
import { MessageActions } from '../messages/actions';
import { ChatHttpFileRequest, ChatHttpRequests } from './http-requests';
import { MyProfileService } from 'app/services/my-profile-service';
import { MessageUtils } from 'app/utils/functions/message-utils';
import { IFilesRequestGenerator } from '../common/http-file-factory';

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
		chat.typingInterlocutors = [];
		chat.photos = { photos: [], hasMore: true };
		chat.videos = { videos: [], hasMore: true };
		chat.files = { files: [], hasMore: true };
		chat.recordings = {
			hasMore: true,
			recordings: [],
		};
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

export function* changeChatVisibilityStateSaga(
	action: ReturnType<typeof ChatActions.changeChatVisibilityState>,
): SagaIterator {
	const chat: Chat = action.payload;
	let response: AxiosResponse;

	try {
		const request: HideChatRequest = {
			chatIds: [chat.id],
			isHidden: true,
		};

		const removeChatRequest = ChatHttpRequests.changeChatVisibilityState;
		response = removeChatRequest.call(yield call(() => removeChatRequest.generator(request)));

		if (response.status === 200) {
			yield put(ChatActions.changeChatVisibilityStateSuccess(chat));
		} else {
			alert('Error chat deletion');
		}
	} catch (e) {
		console.warn(e);
	}
}

function* addUsersToConferenceSaga(action: ReturnType<typeof ChatActions.addUsersToConference>): SagaIterator {
	try {
		const { chat, users } = action.payload;
		const httpRequest = ChatHttpRequests.addMembersIntoConference;
		const userIds = users.map(({ id }) => id);

		const { status } = httpRequest.call(
			yield call(() =>
				httpRequest.generator({
					conferenceId: chat.conference?.id!,
					userIds: userIds,
				}),
			),
		);

		if (status === HTTPStatusCode.OK) {
			yield put(ChatActions.addUsersToConferenceSuccess({ chat, users }));

			action.meta.deferred?.resolve(action.payload.chat);
		} else {
			console.warn('Failed to add users to conference');
		}
	} catch {
		alert('addUsersToConferenceSaga error');
	}
}

function* createConferenceSaga(action: ReturnType<typeof ChatActions.createConference>): SagaIterator {
	const { userIds, name, avatar, description, currentUser } = action.payload;

	try {
		const httpRequest = ChatHttpRequests.createConference;
		const conferenceCreationRequest: ConferenceCreationHTTPReqData = {
			name,
			description,
			userIds,
			currentUser,
			avatarId: avatar?.id,
		};

		const { data } = httpRequest.call(yield call(() => httpRequest.generator(conferenceCreationRequest)));

		const chatId: number = ChatService.getChatIdentifier(undefined, data);
		const chat: Chat = {
			interlocutorType: InterlocutorType.CONFERENCE,
			id: chatId,
			conference: {
				id: data,
				membersCount: userIds.length + 1,
				name: name,
				avatarUrl: avatar?.url,
			},
			typingInterlocutors: [],
			lastMessage: {
				creationDateTime: new Date(),
				id: new Date().getTime(),
				systemMessageType: SystemMessageType.ConferenceCreated,
				text: MessageUtils.createSystemMessage({}),
				chatId: chatId,
				state: MessageState.LOCALMESSAGE,
				userCreator: action.payload.currentUser,
			},
			photos: {
				hasMore: true,
				photos: [],
			},
			videos: {
				hasMore: true,
				videos: [],
			},
			files: {
				hasMore: true,
				files: [],
			},
			recordings: {
				hasMore: true,
				recordings: [],
			},
		};

		yield put(ChatActions.createConferenceSuccess(chat));
		yield put(ChatActions.changeSelectedChat(chat.id));
		action.meta.deferred?.resolve(chat);
	} catch (e) {
		console.warn(e);
		alert('createConferenceSaga error');
	}
}

function* changeConferenceAvatarSaga(action: ReturnType<typeof ChatActions.changeConferenceAvatar>): SagaIterator {
	console.log('avatar change requested', action);
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
		typingInterlocutors: [],
		photos: {
			hasMore: true,
			photos: [],
		},
		videos: {
			hasMore: true,
			videos: [],
		},
		files: {
			hasMore: true,
			files: [],
		},
		recordings: {
			hasMore: true,
			recordings: [],
		},
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
	const httpRequest = ChatHttpRequests.getConferenceMembers;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));
	yield put(ChatActions.getConferenceUsersSuccess({ users: data }));
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

function* getPhotoAttachmentsSaga(action: ReturnType<typeof ChatActions.getPhotoAttachments>): SagaIterator {
	const { chatId, page } = action.payload;

	const httpRequest = ChatHttpRequests.getChatPictureAttachments;
	const { data, status } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

	const hasMore = data.length >= page.limit;

	if (status === HTTPStatusCode.OK) {
		yield put(ChatActions.getPhotoAttachmentsSuccess({ photos: data, hasMore, chatId }));
	} else {
		alert('getPhotoAttachmentsSaga error');
	}
}

function* getVideoAttachmentsSaga(action: ReturnType<typeof ChatActions.getVideoAttachments>): SagaIterator {
	const { chatId, page } = action.payload;

	const httpRequest = ChatHttpRequests.getChatVideoAttachments;
	const { data, status } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

	const hasMore = data.length >= page.limit;

	if (status === HTTPStatusCode.OK) {
		yield put(ChatActions.getVideoAttachmentsSuccess({ videos: data, hasMore, chatId }));
	} else {
		alert('getVideoAttachmentsSaga error');
	}
}

function* getRawAttachmentsSaga(action: ReturnType<typeof ChatActions.getRawAttachments>): SagaIterator {
	const { chatId, page } = action.payload;

	const httpRequest = ChatHttpRequests.getChatRawAttachments;
	const { data, status } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

	const hasMore = data.length >= page.limit;

	if (status === HTTPStatusCode.OK) {
		yield put(ChatActions.getRawAttachmentsSuccess({ files: data, hasMore, chatId }));
	} else {
		alert('getRawAttachmentsSaga error');
	}
}

function* getRecordingsSaga(action: ReturnType<typeof ChatActions.getVoiceAttachments>): SagaIterator {
	const { chatId, page } = action.payload;

	const httpRequest = ChatHttpRequests.getChatAudioAttachments;
	const { data, status } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

	const hasMore = data.length >= page.limit;

	if (status === HTTPStatusCode.OK) {
		yield put(ChatActions.getVoiceAttachmentsSuccess({ recordings: data, hasMore, chatId }));
	} else {
		alert('getRecordingsSaga error');
	}
}

// Upload the specified file
export function* uploadAttachmentSaga(
	action: ReturnType<typeof ChatActions.uploadAttachmentRequestAction>,
): SagaIterator {
	const { file, type, chatId, attachmentId } = action.payload;
	let uploadRequest: IFilesRequestGenerator<AxiosResponse<any>, any>;

	switch (type) {
		case FileType.audio:
			{
				uploadRequest = ChatHttpFileRequest.uploadAudioAttachment;
			}
			break;
		case FileType.raw:
			{
				uploadRequest = ChatHttpFileRequest.uploadFileAttachment;
			}
			break;
		case FileType.picture:
			{
				uploadRequest = ChatHttpFileRequest.uploadPictureAttachment;
			}
			break;
		case FileType.voice:
			{
				uploadRequest = ChatHttpFileRequest.uploadVoiceAttachment;
			}
			break;
		case FileType.video:
			{
				uploadRequest = ChatHttpFileRequest.uploadVideoAttachment;
			}
			break;
	}

	const data = new FormData();

	const uploadData = { file };

	for (let k of Object.entries(uploadData)) {
		data.append(k[0], k[1]);
	}

	yield call(() =>
		uploadRequest.generator(data, {
			onStart: function* (payload: UploadAttachmentSagaStartedData): SagaIterator {
				yield put(ChatActions.uploadAttachmentStartedAction({ chatId, attachmentId, ...payload }));
			},
			onProgress: function* (payload: UploadAttachmentSagaProgressData): SagaIterator {
				yield put(ChatActions.uploadAttachmentProgressAction({ chatId, attachmentId, ...payload }));
			},
			onSuccess: function* (payload: BaseAttachment): SagaIterator {
				yield put(
					ChatActions.uploadAttachmentSuccessAction({
						chatId,
						attachmentId,
						attachment: payload,
					}),
				);
			},
			onFailure: function* (): SagaIterator {
				yield put(ChatActions.uploadAttachmentFailureAction({ chatId, attachmentId }));
			},
		}),
	);
}

function* cancelUploadSaga(action: ReturnType<typeof ChatActions.removeAttachmentAction>): SagaIterator {
	const { chatId, attachmentId } = action.payload;
	const currentAttachment: BaseAttachment = yield select((state: RootState) =>
		state.chats.chats
			.find(({ id }) => id === chatId)
			?.attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId),
	);
	console.log(currentAttachment);
}

export function* resetUnreadMessagesCountSaga(action: ReturnType<typeof ChatActions.markMessagesAsRead>): SagaIterator {
	const httpRequest = ChatHttpRequests.markMessagesAsRead;
	httpRequest.call(yield call(() => httpRequest.generator(action.payload)));
}

export function* getChatInfoSaga(action: ReturnType<typeof ChatActions.getChatInfo>): SagaIterator {
	const httpRequest = ChatHttpRequests.getChatInfo;
	const { data, status } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));

	if (status === HTTPStatusCode.OK) {
		yield put(ChatActions.getChatInfoSuccess({ ...data, ...action.payload }));
	} else {
		alert('getChatInfoSaga error');
	}
}

export function* changeSelectedChatSaga(action: ReturnType<typeof ChatActions.changeSelectedChat>): SagaIterator {
	if (action.payload !== -1) {
		const httpRequest = ChatHttpRequests.getChatById;

		const chatExists =
			(yield select((state: RootState) => state.chats.chats.findIndex(({ id }) => id === action.payload))) > -1;

		console.log(chatExists);

		if (!chatExists) {
			const hasMore = yield select((state: RootState) => state.chats.hasMore);
			const { data, status } = httpRequest.call(
				yield call(() => httpRequest.generator({ chatId: action.payload })),
			);

			if (status === HTTPStatusCode.OK) {
				const chatList: GetChatsResponse = {
					chats: [data],
					hasMore,
					initializedBySearch: false,
				};

				yield put(ChatActions.getChatsSuccess(chatList));
			} else {
				alert('getChatInfoSaga error');
			}
		}
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
	takeLatest(ChatActions.changeChatVisibilityState, changeChatVisibilityStateSaga),
	takeLatest(ChatActions.addUsersToConference, addUsersToConferenceSaga),
	takeLatest(ChatActions.muteChat, muteChatSaga),
	takeLatest(ChatActions.getPhotoAttachments, getPhotoAttachmentsSaga),
	takeLatest(ChatActions.getVideoAttachments, getVideoAttachmentsSaga),
	takeLatest(ChatActions.getRawAttachments, getRawAttachmentsSaga),
	takeLatest(ChatActions.getVoiceAttachments, getRecordingsSaga),
	takeLatest(ChatActions.markMessagesAsRead, resetUnreadMessagesCountSaga),
	takeLatest(ChatActions.getChatInfo, getChatInfoSaga),
	takeLatest(ChatActions.changeSelectedChat, changeSelectedChatSaga),
	takeEvery(ChatActions.uploadAttachmentRequestAction, uploadAttachmentSaga),
	takeEvery(ChatActions.removeAttachmentAction, cancelUploadSaga),
];
