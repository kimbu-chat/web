import { CreateDraftMessage } from '@store/chats/features/create-draft-message/create-draft-message';
import { DiscardDraftMessage } from '@store/chats/features/create-draft-message/discard-draft-message';
import { GetPossibleMembers } from '@store/chats/features/get-possible-members/get-possible-members';
import { MessageAttachmentsUploaded } from '@store/chats/features/upload-attachment/message-attachments-uploaded';

import { AddUsersToGroupChatSuccess } from './features/add-users-to-group-chat/add-users-to-group-chat-success';
import { AddUsersToGroupChat } from './features/add-users-to-group-chat/add-users-to-group-chat';
import { ChangeChatInfoOpened } from './features/change-chat-info-opened/change-chat-info-opened';
import { ChangeChatMutedStatusSuccess } from './features/change-chat-muted-status/change-chat-muted-status-success';
import { ChangeChatMutedStatus } from './features/change-chat-muted-status/change-chat-muted-status';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { ClearChatHistorySuccess } from './features/clear-chat-history/clear-chat-history-success';
import { ClearChatHistory } from './features/clear-chat-history/clear-chat-history';
import { CopyMessages } from './features/copy-messages/copy-messages';
import { CreateGroupChatSuccess } from './features/create-group-chat/create-group-chat-success';
import { CreateGroupChat } from './features/create-group-chat/create-group-chat';
import { CreateMessageSuccess } from './features/create-message/create-message-success';
import { CreateMessage } from './features/create-message/create-message';
import { DeleteMessageSuccess } from './features/delete-message/delete-message-success';
import { DeleteMessage } from './features/delete-message/delete-message';
import { EditGroupChatSuccess } from './features/edit-group-chat/edit-group-chat-success';
import { EditGroupChat } from './features/edit-group-chat/edit-group-chat';
import { EditMessage } from './features/edit-message/edit-message';
import { ResetEditMessage } from './features/edit-message/reset-edit-message';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { SubmitEditMessageSuccess } from './features/edit-message/sumbit-edit-message-success';
import { ForwardMessages } from './features/forward-messages/forward-messages';
import { GetAudioAttachmentsSuccess } from './features/get-audio-attachments/get-audio-attachments-success';
import { GetAudioAttachments } from './features/get-audio-attachments/get-audio-attachments';
import { GetChatInfoSuccess } from './features/get-chat-info/get-chat-info-success';
import { GetChatInfo } from './features/get-chat-info/get-chat-info';
import { GetChatsFailure } from './features/get-chats/get-chats-failure';
import { GetChatsSuccess } from './features/get-chats/get-chats-success';
import { GetChats } from './features/get-chats/get-chats';
import { GetGroupChatUsersSuccess } from './features/get-group-chat-users/get-group-chat-users-success';
import { GetGroupChatUsers } from './features/get-group-chat-users/get-group-chat-users';
import { GetMessagesFailure } from './features/get-messages/get-messages-failure';
import { GetMessagesSuccess } from './features/get-messages/get-messages-success';
import { GetMessages } from './features/get-messages/get-messages';
import { GetPhotoAttachmentsSuccess } from './features/get-photo-attachments/get-photo-attachments-success';
import { GetPhotoAttachments } from './features/get-photo-attachments/get-photo-attachments';
import { GetRawAttachmentsSuccess } from './features/get-raw-attachments/get-raw-attachments-success';
import { GetRawAttachments } from './features/get-raw-attachments/get-raw-attachments';
import { GetVideoAttachmentsSuccess } from './features/get-video-attachments/get-video-attachments-success';
import { GetVideoAttachments } from './features/get-video-attachments/get-video-attachments';
import { GetVoiceAttachmentsSuccess } from './features/get-voice-attachments/get-voice-attachments-success';
import { GetVoiceAttachments } from './features/get-voice-attachments/get-voice-attachments';
import { LeaveGroupChatSuccess } from './features/leave-group-chat/leave-group-chat-success';
import { LeaveGroupChat } from './features/leave-group-chat/leave-group-chat';
import { MarkChatAsReadSuccess } from './features/mark-chat-as-read/mark-chat-as-read-success';
import { MarkChatAsRead } from './features/mark-chat-as-read/mark-chat-as-read';
import { MessageTyping } from './features/message-typing/message-typing';
import { RemoveAllAttachments } from './features/remove-attachment/remove-all-attachments';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { RemoveChatSuccess } from './features/remove-chat/remove-chat-success';
import { RemoveChat } from './features/remove-chat/remove-chat';
import { RemoveUserFromGroupChatSuccess } from './features/remove-user-from-group-chat/remove-user-from-group-chat-success';
import { RemoveUserFromGroupChat } from './features/remove-user-from-group-chat/remove-user-from-group-chat';
import { ReplyToMessage } from './features/reply-to-message/reply-to-message';
import { ResetReplyToMessage } from './features/reply-to-message/reset-reply-to-message';
import { ResetSearchChats } from './features/reset-search-chats/reset-search-chats';
import { ResetSelectedMessages } from './features/select-message/reset-selected-messages';
import { SelectMessage } from './features/select-message/select-message';
import { UnshiftChat } from './features/unshift-chat/unshift-chat';
import { UploadAttachmentFailure } from './features/upload-attachment/upload-attachment-failure';
import { UploadAttachmentProgress } from './features/upload-attachment/upload-attachment-progress';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';
import { UploadAttachmentSuccess } from './features/upload-attachment/upload-attachment-success';
import { UploadVoiceAttachmentSuccess } from './features/upload-voice-attachment/upload-voice-attachment-success';
import { UploadVoiceAttachment } from './features/upload-voice-attachment/upload-voice-attachment';
import { ChatClearedEventHandler } from './socket-events/chat-cleared/chat-cleared-event-handler';
import { ChatMutedStatusChangedEventHandler } from './socket-events/chat-mute-status-changed/chat-mute-status-changed-event-handler';
import { DialogRemovedEventHandler } from './socket-events/dialog-removed/dialog-removed-event-handler';
import { GroupChatCreatedEventHandler } from './socket-events/group-chat-created/group-chat-created-event-handler';
import { GroupChatEditedEventHandler } from './socket-events/group-chat-edited/group-chat-edited-integration-event-handler';
import { MemberLeftGroupChatEventHandler } from './socket-events/member-left-group-chat/member-left-group-chat-event-handler';
import { MemberRemovedFromGroupChatEventHandler } from './socket-events/member-removed-from-group-chat/member-removed-from-group-chat-event-handler';
import { MessageCreatedEventHandlerSuccess } from './socket-events/message-created/message-created-event-handler-success';
import { MessageCreatedEventHandler } from './socket-events/message-created/message-created-event-handler';
import { MessagesDeletedIntegrationEventHandlerSuccess } from './socket-events/message-deleted/messages-deleted-integration-event-handler-success';
import { MessageEditedEventHandler } from './socket-events/message-edited/message-edited-event-handler';
import { MessageReadEventHandler } from './socket-events/message-read/message-read-event-handler';
import { UserMessageTypingEventHandler } from './socket-events/message-typing/message-typing-event-handler';

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
export const getPossibleChatMembersAction = GetPossibleMembers.action;
export const leaveGroupChatAction = LeaveGroupChat.action;
export const leaveGroupChatSuccessAction = LeaveGroupChatSuccess.action;
export const addUsersToGroupChatAction = AddUsersToGroupChat.action;
export const addUsersToGroupChatSuccessAction = AddUsersToGroupChatSuccess.action;
export const uploadAttachmentRequestAction = UploadAttachmentRequest.action;
export const uploadAttachmentProgressAction = UploadAttachmentProgress.action;
export const uploadAttachmentSuccessAction = UploadAttachmentSuccess.action;
export const uploadAttachmentFailureAction = UploadAttachmentFailure.action;
export const removeAttachmentAction = RemoveAttachment.action;
export const uploadMessageAttachmentsSuccess = MessageAttachmentsUploaded.action;
export const markChatAsReadAction = MarkChatAsRead.action;
export const markMessagesAsReadSuccessAction = MarkChatAsReadSuccess.action;
export const getMessagesAction = GetMessages.action;
export const getMessagesSuccessAction = GetMessagesSuccess.action;
export const getMessagesFailureAction = GetMessagesFailure.action;
export const createMessageAction = CreateMessage.action;
export const discardDraftMessageAction = DiscardDraftMessage.action;
export const createDraftMessageAction = CreateDraftMessage.action;
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
export const resetSearchChatsAction = ResetSearchChats.action;
export const uploadVoiceAttachmentAction = UploadVoiceAttachment.action;
export const uploadVoiceAttachmentSuccess = UploadVoiceAttachmentSuccess.action;

// socket-events

export const userMessageTypingEventHandlerAction = UserMessageTypingEventHandler.action;
export const memberLeftGroupChatEventHandlerAction = MemberLeftGroupChatEventHandler.action;
export const memberRemovedFromGroupChatEventHandlerAction =
  MemberRemovedFromGroupChatEventHandler.action;
export const groupChatEditedEventHandlerAction = GroupChatEditedEventHandler.action;
export const groupChatCreatedEventHandlerAction = GroupChatCreatedEventHandler.action;
export const chatMutedStatusChangedEventHandlerAction = ChatMutedStatusChangedEventHandler.action;
export const messageCreatedEventHandlerAction = MessageCreatedEventHandler.action;
export const messageCreatedEventHandlerSuccessAction = MessageCreatedEventHandlerSuccess.action;
export const messageReadEventHandlerAction = MessageReadEventHandler.action;
export const messageEditedEventHandlerAction = MessageEditedEventHandler.action;
export const chatClearedEventHandlerAction = ChatClearedEventHandler.action;
export const messagesDeletedIntegrationEventHandlerSuccessAction =
  MessagesDeletedIntegrationEventHandlerSuccess.action;
export const removeChatAction = RemoveChat.action;
export const removeChatSuccessAction = RemoveChatSuccess.action;
export const dialogRemovedEventHandler = DialogRemovedEventHandler.action;

export type ChatActions =
  // ChatActions
  typeof getChatsAction &
    typeof resetSearchChatsAction &
    typeof getPhotoAttachmentsAction &
    typeof getVideoAttachmentsAction &
    typeof getRawAttachmentsAction &
    typeof getVoiceAttachmentsAction &
    typeof getAudioAttachmentsAction &
    typeof getChatInfoAction &
    typeof getChatsSuccessAction &
    typeof getChatsFailureAction &
    typeof getPhotoAttachmentsSuccessAction &
    typeof getVideoAttachmentsSuccessAction &
    typeof getRawAttachmentsSuccessAction &
    typeof getVoiceAttachmentsSuccessAction &
    typeof getAudioAttachmentsSuccessAction &
    typeof getChatInfoSuccessAction &
    typeof changeSelectedChatAction &
    typeof unshiftChatAction &
    typeof changeChatMutedStatusAction &
    typeof changeChatMutedStatusSuccessAction &
    typeof createGroupChatAction &
    typeof createGroupChatSuccessAction &
    typeof editGroupChatAction &
    typeof editGroupChatSuccessAction &
    typeof getGroupChatUsersAction &
    typeof getGroupChatUsersSuccessAction &
    typeof leaveGroupChatAction &
    typeof leaveGroupChatSuccessAction &
    typeof addUsersToGroupChatAction &
    typeof addUsersToGroupChatSuccessAction &
    typeof uploadAttachmentRequestAction &
    typeof uploadAttachmentProgressAction &
    typeof uploadAttachmentSuccessAction &
    typeof uploadAttachmentFailureAction &
    typeof removeAttachmentAction &
    typeof markChatAsReadAction &
    typeof markMessagesAsReadSuccessAction &
    typeof getMessagesAction &
    typeof getMessagesSuccessAction &
    typeof getMessagesFailureAction &
    typeof createMessageAction &
    typeof createMessageSuccessAction &
    typeof messageTypingAction &
    typeof deleteMessageAction &
    typeof deleteMessageSuccessAction &
    typeof selectMessageAction &
    typeof resetSelectedMessagesAction &
    typeof copyMessagesAction &
    typeof replyToMessageAction &
    typeof resetReplyToMessageAction &
    typeof editMessageAction &
    typeof submitEditMessageAction &
    typeof submitEditMessageSuccessAction &
    typeof resetEditMessageAction &
    typeof clearChatHistoryAction &
    typeof clearChatHistorySuccessAction &
    typeof forwardMessagesAction &
    typeof changeChatInfoOpenedAction &
    typeof removeAllAttachmentsAction &
    typeof removeUserFromGroupChatAction &
    typeof removeUserFromGroupChatSuccessAction &
    typeof removeChatAction &
    typeof removeChatSuccessAction &
    typeof uploadVoiceAttachmentAction &
    typeof uploadVoiceAttachmentSuccess &
    typeof getPossibleChatMembersAction &
    typeof createDraftMessageAction &
    typeof discardDraftMessageAction &
    typeof uploadMessageAttachmentsSuccess &
    // socket-events

    typeof userMessageTypingEventHandlerAction &
    typeof memberLeftGroupChatEventHandlerAction &
    typeof memberRemovedFromGroupChatEventHandlerAction &
    typeof groupChatEditedEventHandlerAction &
    typeof groupChatCreatedEventHandlerAction &
    typeof chatMutedStatusChangedEventHandlerAction &
    typeof messageCreatedEventHandlerAction &
    typeof messageCreatedEventHandlerSuccessAction &
    typeof messageReadEventHandlerAction &
    typeof messageEditedEventHandlerAction &
    typeof chatClearedEventHandlerAction &
    typeof messagesDeletedIntegrationEventHandlerSuccessAction &
    typeof dialogRemovedEventHandler;
