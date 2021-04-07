import { UserMessageTypingEventHandler } from './socket-events/message-typing/message-typing-event-handler';
import { MemberLeftGroupChatEventHandler } from './socket-events/member-left-group-chat/member-left-group-chat-event-handler';
import { GroupChatEditedEventHandler } from './socket-events/group-chat-edited/group-chat-edited-integration-event-handler';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';
import { AddUsersToGroupChat } from './features/add-users-to-group-chat/add-users-to-group-chat';
import { AddUsersToGroupChatSuccess } from './features/add-users-to-group-chat/add-users-to-group-chat-success';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
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
import { GetRawAttachments } from './features/get-raw-attachments/get-raw-attachments';
import { MarkMessagesAsReadSuccess } from './features/mark-messages-as-read/mark-messages-as-read-success';
import { ChatMutedStatusChangedEventHandler } from './socket-events/chat-mute-status-changed/chat-mute-status-changed-event-handler';
import { GroupChatCreatedEventHandler } from './socket-events/group-chat-created/group-chat-created-event-handler';
import { CopyMessages } from './features/copy-messages/copy-messages';
import { CreateMessage } from './features/create-message/create-message';
import { CreateMessageSuccess } from './features/create-message/create-message-success';
import { DeleteMessage } from './features/delete-message/delete-message';
import { DeleteMessageSuccess } from './features/delete-message/delete-message-success';
import { ResetEditMessage } from './features/edit-message/reset-edit-message';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { SubmitEditMessageSuccess } from './features/edit-message/sumbit-edit-message-success';
import { GetMessages } from './features/get-messages/get-messages';
import { GetMessagesFailure } from './features/get-messages/get-messages-failure';
import { GetMessagesSuccess } from './features/get-messages/get-messages-success';
import { MessageTyping } from './features/message-typing/message-typing';
import { ClearChatHistory } from './features/clear-chat-history/clear-chat-history';
import { ClearChatHistorySuccess } from './features/clear-chat-history/clear-chat-history-success';
import { ReplyToMessage } from './features/reply-to-message/reply-to-message';
import { ResetReplyToMessage } from './features/reply-to-message/reset-reply-to-message';
import { ResetSelectedMessages } from './features/select-message/reset-selected-messages';
import { SelectMessage } from './features/select-message/select-message';
import { MessageCreatedEventHandler } from './socket-events/message-created/message-created-event-handler';
import { MessageEditedEventHandler } from './socket-events/message-edited/message-edited-event-handler';
import { MessageReadEventHandler } from './socket-events/message-read/message-read-event-handler';
import { EditMessage } from './features/edit-message/edit-message';
import { ChatClearedEventHandler } from './socket-events/chat-cleared/chat-cleared-event-handler';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { ForwardMessages } from './features/forward-messages/forward-messages';
import { ChangeChatInfoOpened } from './features/change-chat-info-opened/change-chat-info-opened';
import { MessagesDeletedIntegrationEventHandlerSuccess } from './socket-events/message-deleted/messages-deleted-integration-event-handler-success';
import { RemoveAllAttachments } from './features/remove-attachment/remove-all-attachments';
import { RemoveUserFromGroupChat } from './features/remove-user-from-group-chat/remove-user-from-group-chat';
import { RemoveUserFromGroupChatSuccess } from './features/remove-user-from-group-chat/remove-user-from-group-chat-success';
import { MessageCreatedEventHandlerSuccess } from './socket-events/message-created/message-created-event-handler-success';

// ChatActions
export const getChatsAction = GetChats.action;
export const getPhotoAttachmentsAction = GetPhotoAttachments.action;
export const getVideoAttachmentsAction = GetVideoAttachments.action;
export const getRawAttachmentsAction = GetRawAttachments.action;
export const getVoiceAttachmentsAction = GetVoiceAttachments.action;
export const getAudioAttachmentsAction = GetAudioAttachments.action;
export const getChatInfoAction = GetChatInfo.action;
export const getChatsSuccessAction = GetChatsSuccess.action;
export const getChatsFailureAction = GetChatsFailure.action;
export const getPhotoAttachmentsSuccessAction = GetPhotoAttachmentsSuccess.action;
export const getVideoAttachmentsSuccessAction = GetVideoAttachmentsSuccess.action;
export const getRawAttachmentsSuccessAction = GetRawAttachmentsSuccess.action;
export const getVoiceAttachmentsSuccessAction = GetVoiceAttachmentsSuccess.action;
export const getAudioAttachmentsSuccessAction = GetAudioAttachmentsSuccess.action;
export const getChatInfoSuccessAction = GetChatInfoSuccess.action;
export const changeSelectedChatAction = ChangeSelectedChat.action;
export const unshiftChatAction = UnshiftChat.action;
export const changeChatMutedStatusAction = ChangeChatMutedStatus.action;
export const changeChatMutedStatusSuccessAction = ChangeChatMutedStatusSuccess.action;
export const createGroupChatAction = CreateGroupChat.action;
export const createGroupChatSuccessAction = CreateGroupChatSuccess.action;
export const editGroupChatAction = EditGroupChat.action;
export const editGroupChatSuccessAction = EditGroupChatSuccess.action;
export const getGroupChatUsersAction = GetGroupChatUsers.action;
export const getGroupChatUsersSuccessAction = GetGroupChatUsersSuccess.action;
export const leaveGroupChatAction = LeaveGroupChat.action;
export const leaveGroupChatSuccessAction = LeaveGroupChatSuccess.action;
export const addUsersToGroupChatAction = AddUsersToGroupChat.action;
export const addUsersToGroupChatSuccessAction = AddUsersToGroupChatSuccess.action;
export const interlocutorStoppedTypingAction = InterlocutorStoppedTyping.action;
export const uploadAttachmentRequestAction = UploadAttachmentRequest.action;
export const uploadAttachmentProgressAction = UploadAttachmentProgress.action;
export const uploadAttachmentSuccessAction = UploadAttachmentSuccess.action;
export const uploadAttachmentFailureAction = UploadAttachmentFailure.action;
export const removeAttachmentAction = RemoveAttachment.action;
export const markMessagesAsReadAction = MarkMessagesAsRead.action;
export const markMessagesAsReadSuccessAction = MarkMessagesAsReadSuccess.action;
export const getMessagesAction = GetMessages.action;
export const getMessagesSuccessAction = GetMessagesSuccess.action;
export const getMessagesFailureAction = GetMessagesFailure.action;
export const createMessageAction = CreateMessage.action;
export const createMessageSuccessAction = CreateMessageSuccess.action;
export const messageTypingAction = MessageTyping.action;
export const deleteMessageAction = DeleteMessage.action;
export const deleteMessageSuccessAction = DeleteMessageSuccess.action;
export const selectMessageAction = SelectMessage.action;
export const resetSelectedMessagesAction = ResetSelectedMessages.action;
export const copyMessagesAction = CopyMessages.action;
export const replyToMessageAction = ReplyToMessage.action;
export const resetReplyToMessageAction = ResetReplyToMessage.action;
export const editMessageAction = EditMessage.action;
export const submitEditMessageAction = SubmitEditMessage.action;
export const submitEditMessageSuccessAction = SubmitEditMessageSuccess.action;
export const resetEditMessageAction = ResetEditMessage.action;
export const clearChatHistoryAction = ClearChatHistory.action;
export const clearChatHistorySuccessAction = ClearChatHistorySuccess.action;
export const forwardMessagesAction = ForwardMessages.action;
export const changeChatInfoOpenedAction = ChangeChatInfoOpened.action;
export const removeAllAttachmentsAction = RemoveAllAttachments.action;
export const removeUserFromGroupChatAction = RemoveUserFromGroupChat.action;
export const removeUserFromGroupChatSuccessAction = RemoveUserFromGroupChatSuccess.action;

// socket-events

export const userMessageTypingEventHandlerAction = UserMessageTypingEventHandler.action;
export const memberLeftGroupChatEventHandlerAction = MemberLeftGroupChatEventHandler.action;
export const groupChatEditedEventHandlerAction = GroupChatEditedEventHandler.action;
export const groupChatCreatedEventHandlerAction = GroupChatCreatedEventHandler.action;
export const chatMutedStatusChangedEventHandlerAction = ChatMutedStatusChangedEventHandler.action;
export const messageCreatedEventHandlerAction = MessageCreatedEventHandler.action;
export const messageCreatedEventHandlerSuccessAction = MessageCreatedEventHandlerSuccess.action;
export const messageReadEventHandlerAction = MessageReadEventHandler.action;
export const messageEditedEventHandlerAction = MessageEditedEventHandler.action;
export const chatClearedEventHandlerAction = ChatClearedEventHandler.action;
export const userEditedEventHandlerAction = UserEditedEventHandler.action;
export const messagesDeletedIntegrationEventHandlerSuccessAction =
  MessagesDeletedIntegrationEventHandlerSuccess.action;

export const ChatActions = {
  // ChatActions
  getChatsAction,
  getPhotoAttachmentsAction,
  getVideoAttachmentsAction,
  getRawAttachmentsAction,
  getVoiceAttachmentsAction,
  getAudioAttachmentsAction,
  getChatInfoAction,
  getChatsSuccessAction,
  getChatsFailureAction,
  getPhotoAttachmentsSuccessAction,
  getVideoAttachmentsSuccessAction,
  getRawAttachmentsSuccessAction,
  getVoiceAttachmentsSuccessAction,
  getAudioAttachmentsSuccessAction,
  getChatInfoSuccessAction,
  changeSelectedChatAction,
  unshiftChatAction,
  changeChatMutedStatusAction,
  changeChatMutedStatusSuccessAction,
  createGroupChatAction,
  createGroupChatSuccessAction,
  editGroupChatAction,
  editGroupChatSuccessAction,
  getGroupChatUsersAction,
  getGroupChatUsersSuccessAction,
  leaveGroupChatAction,
  leaveGroupChatSuccessAction,
  addUsersToGroupChatAction,
  addUsersToGroupChatSuccessAction,
  interlocutorStoppedTypingAction,
  uploadAttachmentRequestAction,
  uploadAttachmentProgressAction,
  uploadAttachmentSuccessAction,
  uploadAttachmentFailureAction,
  removeAttachmentAction,
  markMessagesAsReadAction,
  markMessagesAsReadSuccessAction,
  getMessagesAction,
  getMessagesSuccessAction,
  getMessagesFailureAction,
  createMessageAction,
  createMessageSuccessAction,
  messageTypingAction,
  deleteMessageAction,
  deleteMessageSuccessAction,
  selectMessageAction,
  resetSelectedMessagesAction,
  copyMessagesAction,
  replyToMessageAction,
  resetReplyToMessageAction,
  editMessageAction,
  submitEditMessageAction,
  submitEditMessageSuccessAction,
  resetEditMessageAction,
  clearChatHistoryAction,
  clearChatHistorySuccessAction,
  forwardMessagesAction,
  changeChatInfoOpenedAction,
  removeAllAttachmentsAction,
  removeUserFromGroupChatAction,
  removeUserFromGroupChatSuccessAction,

  // socket-events

  userMessageTypingEventHandlerAction,
  memberLeftGroupChatEventHandlerAction,
  groupChatEditedEventHandlerAction,
  groupChatCreatedEventHandlerAction,
  chatMutedStatusChangedEventHandlerAction,
  messageCreatedEventHandlerAction,
  messageCreatedEventHandlerSuccessAction,
  messageReadEventHandlerAction,
  messageEditedEventHandlerAction,
  chatClearedEventHandlerAction,
  userEditedEventHandlerAction,
  messagesDeletedIntegrationEventHandlerSuccessAction,
};
