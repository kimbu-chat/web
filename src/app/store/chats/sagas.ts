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
	GroupChatCreationHTTPReqData,
	GroupChat,
	EditGroupChatHTTPReqData,
} from './models';
import { MessageState, SystemMessageType, Message, CreateMessageRequest } from '../messages/models';
import { ChatService } from './chat-service';
import { ChatActions } from './actions';
import { SagaIterator } from 'redux-saga';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { GroupChatCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/group-chat-сreated-integration-event';
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
		chat.id = ChatService.getChatIdentifier(chat.interlocutor?.id, chat.groupChat?.id);
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

function* addUsersToGroupChatSaga(action: ReturnType<typeof ChatActions.addUsersToGroupChat>): SagaIterator {
	try {
		const { chat, users } = action.payload;
		const httpRequest = ChatHttpRequests.addMembersIntoGroupChat;
		const userIds = users.map(({ id }) => id);

		const { status } = httpRequest.call(
			yield call(() =>
				httpRequest.generator({
					groupChatId: chat.groupChat!.id,
					userIds: userIds,
				}),
			),
		);

		if (status === HTTPStatusCode.OK) {
			yield put(ChatActions.addUsersToGroupChatSuccess({ chat, users }));

			action.meta.deferred?.resolve(action.payload.chat);
		} else {
			console.warn('Failed to add users to groupChat');
		}
	} catch {
		alert('addUsersToGroupChatSaga error');
	}
}

function* createGroupChatSaga(action: ReturnType<typeof ChatActions.createGroupChat>): SagaIterator {
	const { userIds, name, avatar, description, currentUser } = action.payload;

	try {
		const httpRequest = ChatHttpRequests.createGroupChat;
		const groupChatCreationRequest: GroupChatCreationHTTPReqData = {
			name,
			description,
			userIds,
			currentUser,
			avatarId: avatar?.id,
		};

		const { data } = httpRequest.call(yield call(() => httpRequest.generator(groupChatCreationRequest)));

		const chatId: number = ChatService.getChatIdentifier(undefined, data);
		const chat: Chat = {
			interlocutorType: InterlocutorType.GROUP_CHAT,
			id: chatId,
			groupChat: {
				id: data,
				membersCount: userIds.length + 1,
				name: name,
				avatar: action.payload.avatar,
				userCreatorId: currentUser.id,
			},
			typingInterlocutors: [],
			lastMessage: {
				creationDateTime: new Date(),
				id: new Date().getTime(),
				systemMessageType: SystemMessageType.GroupChatCreated,
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

		yield put(ChatActions.createGroupChatSuccess(chat));
		yield put(ChatActions.changeSelectedChat(chat.id));
		action.meta.deferred?.resolve(chat);
	} catch (e) {
		console.warn(e);
		alert('createGroupChatSaga error');
	}
}

function* createGroupChatFromEventSaga(action: ReturnType<typeof ChatActions.createGroupChatFromEvent>): SagaIterator {
	const payload: GroupChatCreatedIntegrationEvent = action.payload;
	const chatId: number = ChatService.getChatIdentifier(undefined, payload.objectId);
	const currentUser = new MyProfileService().myProfile;

	const message: Message = {
		systemMessageType: SystemMessageType.GroupChatCreated,
		text: MessageUtils.createSystemMessage({}),
		creationDateTime: new Date(new Date().toUTCString()),
		userCreator: action.payload.userCreator,
		state: MessageState.READ,
		chatId: chatId,
		id: payload.systemMessageId,
	};

	const chat: Chat = {
		interlocutorType: InterlocutorType.GROUP_CHAT,
		id: chatId,
		groupChat: {
			id: payload.objectId,
			membersCount: payload.memberIds.length,
			name: action.payload.name,
		} as GroupChat,
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

function* getGroupChatUsersSaga(action: ReturnType<typeof ChatActions.getGroupChatUsers>): SagaIterator {
	const httpRequest = ChatHttpRequests.getGroupChatMembers;
	const { data } = httpRequest.call(yield call(() => httpRequest.generator(action.payload)));
	yield put(ChatActions.getGroupChatUsersSuccess({ users: data }));
}

function* leaveGroupChatSaga(action: ReturnType<typeof ChatActions.leaveGroupChat>): SagaIterator {
	try {
		const chat: Chat = action.payload;
		const httpRequest = ChatHttpRequests.leaveGroupChat;
		const { status } = httpRequest.call(yield call(() => httpRequest.generator(chat.groupChat!.id)));
		if (status === HTTPStatusCode.OK) {
			yield put(ChatActions.leaveGroupChatSuccess(action.payload));
			action.meta.deferred?.resolve();
		} else {
			alert('Error. http status is ' + status);
		}
	} catch {
		alert('leaveGroupChatSaga error');
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

export function* editGroupChatSaga(action: ReturnType<typeof ChatActions.editGroupChat>): SagaIterator {
	const httpRequest = ChatHttpRequests.editGroupChat;

	const requestData: EditGroupChatHTTPReqData = {
		id: action.payload.id,
		name: action.payload.name,
		description: action.payload.description,
		avatarId: action.payload.avatar?.id,
	};

	const { status } = httpRequest.call(yield call(() => httpRequest.generator(requestData)));

	if (status === HTTPStatusCode.OK) {
		yield put(ChatActions.editGroupChatSuccess(action.payload));
	} else {
		alert('getChatInfoSaga error');
	}
}

export const ChatSagas = [
	takeLatest(ChatActions.getChats, getChatsSaga),
	takeLatest(ChatActions.leaveGroupChat, leaveGroupChatSaga),
	takeLatest(ChatActions.getGroupChatUsers, getGroupChatUsersSaga),
	takeLatest(ChatActions.createGroupChatFromEvent, createGroupChatFromEventSaga),
	takeLatest(ChatActions.createGroupChat, createGroupChatSaga),
	takeLatest(ChatActions.changeChatVisibilityState, changeChatVisibilityStateSaga),
	takeLatest(ChatActions.addUsersToGroupChat, addUsersToGroupChatSaga),
	takeLatest(ChatActions.muteChat, muteChatSaga),
	takeLatest(ChatActions.getPhotoAttachments, getPhotoAttachmentsSaga),
	takeLatest(ChatActions.getVideoAttachments, getVideoAttachmentsSaga),
	takeLatest(ChatActions.getRawAttachments, getRawAttachmentsSaga),
	takeLatest(ChatActions.getVoiceAttachments, getRecordingsSaga),
	takeLatest(ChatActions.markMessagesAsRead, resetUnreadMessagesCountSaga),
	takeLatest(ChatActions.getChatInfo, getChatInfoSaga),
	takeLatest(ChatActions.changeSelectedChat, changeSelectedChatSaga),
	takeLatest(ChatActions.editGroupChat, editGroupChatSaga),
	takeEvery(ChatActions.uploadAttachmentRequestAction, uploadAttachmentSaga),
	takeEvery(ChatActions.removeAttachmentAction, cancelUploadSaga),
];
