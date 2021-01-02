import { UserMessageTypingEventHandler } from 'app/store/chats/socket-events/message-typing/message-typing-event-handler';
import { MemberLeftGroupChatEventHandler } from 'store/chats/socket-events/member-left-group-chat/member-left-group-chat-event-handler';
import { GroupChatEditedEventHandler } from 'store/chats/socket-events/group-chat-edited/group-chat-edited-integration-event-handler';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';
import { AddUsersToGroupChat } from './features/add-users-to-group-chat/add-users-to-group-chat';
import { AddUsersToGroupChatSuccess } from './features/add-users-to-group-chat/add-users-to-group-chat-success';
import { ChangeChatVisibilityState } from './features/change-chat-visibility-state/change-chat-visibility-state';
import { ChangeChatVisibilityStateSuccess } from './features/change-chat-visibility-state/change-chat-visibility-state-success';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { CreateChat } from './features/create-chat/create-chat';
import { CreateGroupChat } from './features/create-group-chat/create-group-chat';
import { CreateGroupChatSuccess } from './features/create-group-chat/create-group-chat-success';
import { EditGroupChat } from './features/edit-group-chat/edit-group-chat';
import { EditGroupChatSuccess } from './features/edit-group-chat/edit-group-chat-success';
import { GetAudioAttachments } from './features/get-audio-attachments/get-audio-attachments';
import { GetAudioAttachmentsSuccess } from './features/get-audio-attachments/get-audio-attachments-success';
import { GetChatInfo } from './features/get-chat-info/get-chat-info';
import { GetChatInfoSuccess } from './features/get-chat-info/get-chat-info-success';
import { GetChats } from './features/get-chats/get-chats';
import { GetChatsFailure } from './features/get-chats/get-chats-failure';
import { GetChatsSuccess } from './features/get-chats/get-chats-success';
import { GetGroupChatUsers } from './features/get-group-chat-users/get-group-chat-users';
import { GetGroupChatUsersSuccess } from './features/get-group-chat-users/get-group-chat-users-success';
import { GetPhotoAttachments } from './features/get-photo-attachments/get-photo-attachments';
import { GetPhotoAttachmentsSuccess } from './features/get-photo-attachments/get-photo-attachments-success';
import { GetRawAttachmentsSuccess } from './features/get-raw-attachments/get-raw-attachments-success';
import { GetVideoAttachments } from './features/get-video-attachments/get-video-attachments';
import { GetVideoAttachmentsSuccess } from './features/get-video-attachments/get-video-attachments-success';
import { GetVoiceAttachments } from './features/get-voice-attachments/get-voice-attachments';
import { GetVoiceAttachmentsSuccess } from './features/get-voice-attachments/get-voice-attachments-success';
import { InterlocutorStoppedTyping } from './features/interlocutor-message-typing/interlocutor-stopped-typing';
import { LeaveGroupChat } from './features/leave-group-chat/leave-group-chat';
import { LeaveGroupChatSuccess } from './features/leave-group-chat/leave-group-chat-success';
import { MarkMessagesAsRead } from './features/mark-messages-as-read/mark-messages-as-read';
import { ChangeChatMutedStatus } from './features/change-chat-muted-status/change-chat-muted-status';
import { ChangeChatMutedStatusSuccess } from './features/change-chat-muted-status/change-chat-muted-status-success';
import { UnshiftChat } from './features/unshift-chat/unshift-chat';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { UploadAttachmentFailure } from './features/upload-attachment/upload-attachment-failure';
import { UploadAttachmentProgress } from './features/upload-attachment/upload-attachment-progress';
import { UploadAttachmentSuccess } from './features/upload-attachment/upload-attachment-success';
import { ChangeLastMessage } from './features/change-last-message/change-last-message';
import { GetRawAttachments } from './features/get-raw-attachments/get-raw-attachments';
import { MarkMessagesAsReadSuccess } from './features/mark-messages-as-read/mark-messages-as-read-success';
import { ChatMutedStatusChangedEventHandler } from './socket-events/chat-mute-status-changed/chat-mute-status-changed-event-handler';
import { GroupChatCreatedEventHandler } from './socket-events/group-chat-created/group-chat-created-event-handler';

export namespace ChatActions {
  export const getChats = GetChats.action;
  export const getPhotoAttachments = GetPhotoAttachments.action;
  export const getVideoAttachments = GetVideoAttachments.action;
  export const getRawAttachments = GetRawAttachments.action;
  export const getVoiceAttachments = GetVoiceAttachments.action;
  export const getAudioAttachments = GetAudioAttachments.action;
  export const getChatInfo = GetChatInfo.action;

  export const getChatsSuccess = GetChatsSuccess.action;
  export const getChatsFailure = GetChatsFailure.action;
  export const getPhotoAttachmentsSuccess = GetPhotoAttachmentsSuccess.action;
  export const getVideoAttachmentsSuccess = GetVideoAttachmentsSuccess.action;
  export const getRawAttachmentsSuccess = GetRawAttachmentsSuccess.action;
  export const getVoiceAttachmentsSuccess = GetVoiceAttachmentsSuccess.action;
  export const getAudioAttachmentsSuccess = GetAudioAttachmentsSuccess.action;
  export const getChatInfoSuccess = GetChatInfoSuccess.action;

  export const changeSelectedChat = ChangeSelectedChat.action;
  export const changeChatVisibilityState = ChangeChatVisibilityState.action;
  export const unshiftChat = UnshiftChat.action;
  export const createChat = CreateChat.action;
  export const changeChatVisibilityStateSuccess = ChangeChatVisibilityStateSuccess.action;
  export const changeChatMutedStatus = ChangeChatMutedStatus.action;
  export const changeChatMutedStatusSuccess = ChangeChatMutedStatusSuccess.action;
  export const createGroupChat = CreateGroupChat.action;
  export const createGroupChatSuccess = CreateGroupChatSuccess.action;
  export const editGroupChat = EditGroupChat.action;
  export const editGroupChatSuccess = EditGroupChatSuccess.action;
  export const getGroupChatUsers = GetGroupChatUsers.action;
  export const getGroupChatUsersSuccess = GetGroupChatUsersSuccess.action;
  export const leaveGroupChat = LeaveGroupChat.action;
  export const leaveGroupChatSuccess = LeaveGroupChatSuccess.action;
  export const addUsersToGroupChat = AddUsersToGroupChat.action;
  export const addUsersToGroupChatSuccess = AddUsersToGroupChatSuccess.action;
  export const interlocutorStoppedTyping = InterlocutorStoppedTyping.action;

  export const uploadAttachmentRequestAction = UploadAttachmentRequest.action;
  export const uploadAttachmentProgressAction = UploadAttachmentProgress.action;
  export const uploadAttachmentSuccessAction = UploadAttachmentSuccess.action;
  export const uploadAttachmentFailureAction = UploadAttachmentFailure.action;
  export const removeAttachmentAction = RemoveAttachment.action;

  export const markMessagesAsRead = MarkMessagesAsRead.action;
  export const markMessagesAsReadSuccess = MarkMessagesAsReadSuccess.action;

  export const changeLastMessageAction = ChangeLastMessage.action;

  // socket-events

  export const userMessageTypingEventHandler = UserMessageTypingEventHandler.action;
  export const memberLeftGroupChatEventHandler = MemberLeftGroupChatEventHandler.action;
  export const groupChatEditedEventHandler = GroupChatEditedEventHandler.action;
  export const groupChatCreatedEventHandler = GroupChatCreatedEventHandler.action;
  export const chatMutedStatusChangedEventHandler = ChatMutedStatusChangedEventHandler.action;
}
