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

// ChatActions
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
export const unshiftChat = UnshiftChat.action;
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
export const getMessages = GetMessages.action;
export const getMessagesSuccess = GetMessagesSuccess.action;
export const getMessagesFailure = GetMessagesFailure.action;
export const createMessage = CreateMessage.action;
export const createMessageSuccess = CreateMessageSuccess.action;
export const messageTyping = MessageTyping.action;
export const deleteMessage = DeleteMessage.action;
export const deleteMessageSuccess = DeleteMessageSuccess.action;
export const selectMessage = SelectMessage.action;
export const resetSelectedMessages = ResetSelectedMessages.action;
export const copyMessages = CopyMessages.action;
export const replyToMessage = ReplyToMessage.action;
export const resetReplyToMessage = ResetReplyToMessage.action;
export const editMessage = EditMessage.action;
export const submitEditMessage = SubmitEditMessage.action;
export const submitEditMessageSuccess = SubmitEditMessageSuccess.action;
export const resetEditMessage = ResetEditMessage.action;
export const clearChatHistory = ClearChatHistory.action;
export const clearChatHistorySuccess = ClearChatHistorySuccess.action;
export const forwardMessages = ForwardMessages.action;
export const changeChatInfoOpened = ChangeChatInfoOpened.action;
export const removeAllAttachments = RemoveAllAttachments.action;
export const removeUserFromGroupChat = RemoveUserFromGroupChat.action;
export const removeUserFromGroupChatSuccess = RemoveUserFromGroupChatSuccess.action;

// socket-events

export const userMessageTypingEventHandler = UserMessageTypingEventHandler.action;
export const memberLeftGroupChatEventHandler = MemberLeftGroupChatEventHandler.action;
export const groupChatEditedEventHandler = GroupChatEditedEventHandler.action;
export const groupChatCreatedEventHandler = GroupChatCreatedEventHandler.action;
export const chatMutedStatusChangedEventHandler = ChatMutedStatusChangedEventHandler.action;
export const messageCreatedEventHandler = MessageCreatedEventHandler.action;
export const messageReadEventHandler = MessageReadEventHandler.action;
export const messageEditedEventHandler = MessageEditedEventHandler.action;
export const chatClearedEventHandler = ChatClearedEventHandler.action;
export const userEditedEventHandler = UserEditedEventHandler.action;
export const messagesDeletedIntegrationEventHandlerSuccess =
  MessagesDeletedIntegrationEventHandlerSuccess.action;
