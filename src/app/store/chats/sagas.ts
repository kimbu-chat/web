import { RootState } from './../root-reducer';
import { FileType } from 'app/store/messages/models';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
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
} from './models';
import { MessageState, SystemMessageType, Message, CreateMessageRequest } from '../messages/models';
import { ChatService } from './chat-service';
import { ChatActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { FileUploadRequest, ErrorUploadResponse, uploadFileSaga } from 'app/utils/file-uploader/file-uploader';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { ConferenceCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/conference-сreated-integration-event';
import { MessageActions } from '../messages/actions';
import { ChatHttpFileRequest, ChatHttpRequests } from './http-requests';
import { UpdateAvatarResponse } from '../common/models';
import { MyProfileService } from 'app/services/my-profile-service';
import { getType } from 'typesafe-actions';
import { MessageUtils } from 'app/utils/functions/message-utils';
import { audioRecordingsToDisplay, filesToDisplay, photoToDisplay, videoToDisplay } from './temporal';
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
			url: 'https://files.ravudi.com/api/conference-avatars/',
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

		action.payload.conferenceId = data;
		action.payload.avatarData = avatar;

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

function* getPhotoSaga(action: ReturnType<typeof ChatActions.getPhoto>): SagaIterator {
	const { chatId, page } = action.payload;

	//TODO:Replace this with HTTP request logic
	yield delay(3000);
	const response = photoToDisplay.slice(page.offset, page.offset + page.limit);
	const hasMore = response.length >= page.limit;

	yield put(ChatActions.getPhotoSuccess({ photos: response, hasMore, chatId }));
}

function* getVideoSaga(action: ReturnType<typeof ChatActions.getVideo>): SagaIterator {
	const { chatId, page } = action.payload;

	//TODO:Replace this with HTTP request logic
	yield delay(3000);
	const response = videoToDisplay.slice(page.offset, page.offset + page.limit);
	const hasMore = response.length >= page.limit;

	yield put(ChatActions.getVideoSuccess({ videos: response, hasMore, chatId }));
}

function* getFilesSaga(action: ReturnType<typeof ChatActions.getFiles>): SagaIterator {
	const { chatId, page } = action.payload;

	//TODO:Replace this with HTTP request logic
	yield delay(3000);
	const response = filesToDisplay.slice(page.offset, page.offset + page.limit);
	const hasMore = response.length >= page.limit;

	yield put(ChatActions.getFilesSuccess({ files: response, hasMore, chatId }));
}

function* getRecordingsSaga(action: ReturnType<typeof ChatActions.getRecordings>): SagaIterator {
	const { chatId, page } = action.payload;

	//TODO:Replace this with HTTP request logic
	yield delay(3000);
	const response = audioRecordingsToDisplay.slice(page.offset, page.offset + page.limit);
	const hasMore = response.length >= page.limit;

	yield put(ChatActions.getRecordingsSuccess({ recordings: response, hasMore, chatId }));
}

// Upload the specified file
export function* uploadAttachmentSaga(
	action: ReturnType<typeof ChatActions.uploadAttachmentRequestAction>,
): SagaIterator {
	const { file, type, chatId, attachmentId } = action.payload;
	let uploadRequest: IFilesRequestGenerator<AxiosResponse<any>, any>;

	switch (type) {
		case FileType.music:
			{
				uploadRequest = ChatHttpFileRequest.uploadAudioAttachment;
			}
			break;
		case FileType.file:
			{
				uploadRequest = ChatHttpFileRequest.uploadFileAttachment;
			}
			break;
		case FileType.photo:
			{
				uploadRequest = ChatHttpFileRequest.uploadPictureAttachment;
			}
			break;
		case FileType.recording:
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
	takeLatest(ChatActions.getPhoto, getPhotoSaga),
	takeLatest(ChatActions.getVideo, getVideoSaga),
	takeLatest(ChatActions.getFiles, getFilesSaga),
	takeLatest(ChatActions.getRecordings, getRecordingsSaga),
	takeEvery(ChatActions.uploadAttachmentRequestAction, uploadAttachmentSaga),
	takeEvery(ChatActions.removeAttachmentAction, cancelUploadSaga),
];
