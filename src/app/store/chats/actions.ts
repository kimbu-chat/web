import {
	GetChatsActionData,
	Chat,
	GetChatsResponse,
	GroupChatCreationReqData,
	GetGroupChatUsersRequest,
	AddUsersToGroupChatActionData,
	getPhotoAttachmentsRequest,
	getVideoAttachmentsRequest,
	getPhotoAttachmentsResponse,
	getVideoAttachmentsResponse,
	getRawAttachmentsRequest,
	getRawAttachmentsResponse,
	UploadAttachmentReqData,
	UploadAttachmentProgressData,
	UploadAttachmentFailedData,
	UploadAttachmentSuccessData,
	RemoveAttachmentReqData,
	GetRecordingsRequest,
	GetRecordingsResponse,
	MarkMessagesAsReadReqData,
	GetChatInfoRequest,
	GetChatInfoResponse,
	EditGroupChatReqData,
	GetAudioAttachmentsRequest,
	GetAudioAttachmentsResponse,
} from './models';
import { IntercolutorMessageTypingIntegrationEvent } from '../middlewares/websockets/integration-events/interlocutor-message-typing-integration-event';
import { GroupChatCreatedIntegrationEvent } from '../middlewares/websockets/integration-events/group-chat-сreated-integration-event';
import { createAction } from 'typesafe-actions';
import { createEmptyAction, Meta } from '../common/actions';
import { MessagesReadIntegrationEvent } from '../middlewares/websockets/integration-events/messages-read-integration-event';
import { GetGroupChatUsersSuccessActionData } from '../friends/models';

export namespace ChatActions {
	export const getChats = createAction('GET_CHATS')<GetChatsActionData>();
	export const getPhotoAttachments = createAction('GET_PHOTO_ATTACHMENTS')<getPhotoAttachmentsRequest>();
	export const getVideoAttachments = createAction('GET_VIDEO_ATTACHMENTS')<getVideoAttachmentsRequest>();
	export const getRawAttachments = createAction('GET_RAW_ATTACHMENTS')<getRawAttachmentsRequest>();
	export const getVoiceAttachments = createAction('GET_VOICE_ATTACHMENTS')<GetRecordingsRequest>();
	export const getAudioAttachments = createAction('GET_AUDIO_ATTACHMENTS')<GetAudioAttachmentsRequest>();
	export const getChatInfo = createAction('GET_CHAT_INFO')<GetChatInfoRequest>();
	export const getChatsSuccess = createAction('GET_CHATS_SUCCESS')<GetChatsResponse>();
	export const getChatsFailure = createEmptyAction('GET_CHATS_FAILURE');
	export const getPhotoAttachmentsSuccess = createAction('GET_PHOTO_ATTACHMENTS_SUCCESS')<
		getPhotoAttachmentsResponse
	>();
	export const getVideoAttachmentsSuccess = createAction('GET_VIDEO_ATTACHMENTS_SUCCESS')<
		getVideoAttachmentsResponse
	>();
	export const getRawAttachmentsSuccess = createAction('GET_FILES_ATTACHMENTS_SUCCESS')<getRawAttachmentsResponse>();
	export const getVoiceAttachmentsSuccess = createAction('GET_VOICE_ATTACHMENTS_SUCCESS')<GetRecordingsResponse>();
	export const getAudioAttachmentsSuccess = createAction('GET_AUDIO_ATTACHMENTS_SUCCESS')<
		GetAudioAttachmentsResponse
	>();
	export const getChatInfoSuccess = createAction('GET_CHAT_INFO_SUCCESS')<GetChatInfoResponse>();
	export const changeSelectedChat = createAction('CHANGE_SELECTED_CHAT')<number>();
	export const changeChatVisibilityState = createAction('CHANGE_CHAT_VISIBILITY_STATE')<Chat>();
	export const changeChatVisibilityStateSuccess = createAction('CHANGE_CHAT_VISIBILITY_STATE_SUCCESS')<Chat>();
	export const muteChat = createAction('MUTE_CHAT')<Chat>();
	export const muteChatSuccess = createAction('MUTE_CHAT_SUCCESS')<Chat>();
	export const createGroupChat = createAction('CREATE_GROUP_CHAT')<GroupChatCreationReqData, Meta>();
	export const createGroupChatSuccess = createAction('CREATE_GROUP_CHAT_SUCCESS')<Chat>();
	export const editGroupChat = createAction('EDIT_GROUP_CHAT')<EditGroupChatReqData>();
	export const editGroupChatSuccess = createAction('EDIT_GROUP_CHAT_SUCCESS')<EditGroupChatReqData>();
	export const createGroupChatFromEvent = createAction('CREATE_GROUP_CHAT_FROM_EVENT')<
		GroupChatCreatedIntegrationEvent
	>();
	export const getGroupChatUsers = createAction('GET_GROUP_CHAT_USERS')<GetGroupChatUsersRequest>();
	export const getGroupChatUsersSuccess = createAction('GET_GROUP_CHAT_USERS_SUCCESS')<
		GetGroupChatUsersSuccessActionData
	>();
	export const leaveGroupChat = createAction('LEAVE_GROUP_CHAT')<Chat, Meta>();
	export const leaveGroupChatSuccess = createAction('LEAVE_GROUP_CHAT_SUCCESS')<Chat>();
	export const addUsersToGroupChat = createAction('ADD_USERS_TO_GROUP_CHAT')<AddUsersToGroupChatActionData, Meta>();
	export const addUsersToGroupChatSuccess = createAction('ADD_USERS_TO_GROUP_CHAT_SUCCESS')<
		AddUsersToGroupChatActionData
	>();
	export const changeInterlocutorLastReadMessageId = createAction('GROUP_CHAT_MESSAGE_READ_FROM_EVENT')<
		MessagesReadIntegrationEvent
	>();
	export const interlocutorStoppedTyping = createAction('INTERLOCUTOR_STOPPED_TYPING')<
		IntercolutorMessageTypingIntegrationEvent
	>();
	export const interlocutorMessageTyping = createAction('INTERLOCUTOR_MESSAGE_TYPING_EVENT')<
		IntercolutorMessageTypingIntegrationEvent
	>();
	export const uploadAttachmentRequestAction = createAction('UPLOAD_ATTACHMENT_REQUEST')<UploadAttachmentReqData>();
	export const uploadAttachmentProgressAction = createAction('UPLOAD_ATTACHMENT_PROGRESS')<
		UploadAttachmentProgressData
	>();
	export const uploadAttachmentSuccessAction = createAction('UPLOAD_ATTACHMENT_SUCCESS')<
		UploadAttachmentSuccessData
	>();
	export const uploadAttachmentFailureAction = createAction('UPLOAD_ATTACHMENT_FAILURE')<
		UploadAttachmentFailedData
	>();
	export const removeAttachmentAction = createAction('REMOVE_ATTACHMENT')<RemoveAttachmentReqData>();
	export const markMessagesAsRead = createAction('RESET_UNREAD_MESSAGES_COUNT')<MarkMessagesAsReadReqData>();
}
