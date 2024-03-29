import { all, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

import { GetPossibleMembers } from '@store/chats/features/get-possible-members/get-possible-members';
import { UploadAttachmentSuccess } from '@store/chats/features/upload-attachment/upload-attachment-success';

import { AddUsersToGroupChat } from './features/add-users-to-group-chat/add-users-to-group-chat';
import { ChangeChatMutedStatus } from './features/change-chat-muted-status/change-chat-muted-status';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { ClearChatHistory } from './features/clear-chat-history/clear-chat-history';
import { CopyMessages } from './features/copy-messages/copy-messages';
import { CreateGroupChat } from './features/create-group-chat/create-group-chat';
import { CreateMessage } from './features/create-message/create-message';
import { CreateMessageSuccess } from './features/create-message/create-message-success';
import { DeleteMessage } from './features/delete-message/delete-message';
import { EditGroupChat } from './features/edit-group-chat/edit-group-chat';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { ForwardMessages } from './features/forward-messages/forward-messages';
import { GetAudioAttachments } from './features/get-audio-attachments/get-audio-attachments';
import { GetChatInfo } from './features/get-chat-info/get-chat-info';
import { GetChats } from './features/get-chats/get-chats';
import { GetGroupChatUsers } from './features/get-group-chat-users/get-group-chat-users';
import { GetMessages } from './features/get-messages/get-messages';
import { GetPhotoAttachments } from './features/get-photo-attachments/get-photo-attachments';
import { GetRawAttachments } from './features/get-raw-attachments/get-raw-attachments';
import { GetVideoAttachments } from './features/get-video-attachments/get-video-attachments';
import { GetVoiceAttachments } from './features/get-voice-attachments/get-voice-attachments';
import { LeaveGroupChat } from './features/leave-group-chat/leave-group-chat';
import { MarkChatAsRead } from './features/mark-chat-as-read/mark-chat-as-read';
import { MessageTyping } from './features/message-typing/message-typing';
import { RemoveAllAttachments } from './features/remove-attachment/remove-all-attachments';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { RemoveChat } from './features/remove-chat/remove-chat';
import { RemoveUserFromGroupChat } from './features/remove-user-from-group-chat/remove-user-from-group-chat';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';
import { UploadVoiceAttachment } from './features/upload-voice-attachment/upload-voice-attachment';
import { MessageCreatedEventHandler } from './socket-events/message-created/message-created-event-handler';
import { MessagesDeletedIntegrationEventHandler } from './socket-events/message-deleted/messages-deleted-integration-event-handler';
import { UserMessageTypingEventHandler } from './socket-events/message-typing/message-typing-event-handler';

export function* chatSaga() {
  yield all([
    takeLatest(GetChats.action, GetChats.saga),
    takeLatest(LeaveGroupChat.action, LeaveGroupChat.saga),
    takeLatest(GetGroupChatUsers.action, GetGroupChatUsers.saga),
    takeLatest(GetPossibleMembers.action, GetPossibleMembers.saga),
    takeLatest(CreateGroupChat.action, CreateGroupChat.saga),
    takeLatest(AddUsersToGroupChat.action, AddUsersToGroupChat.saga),
    takeLatest(ChangeChatMutedStatus.action, ChangeChatMutedStatus.saga),
    takeLatest(GetPhotoAttachments.action, GetPhotoAttachments.saga),
    takeLatest(GetVideoAttachments.action, GetVideoAttachments.saga),
    takeLatest(GetRawAttachments.action, GetRawAttachments.saga),
    takeLatest(GetVoiceAttachments.action, GetVoiceAttachments.saga),
    takeLatest(GetAudioAttachments.action, GetAudioAttachments.saga),
    takeLatest(MarkChatAsRead.action, MarkChatAsRead.saga),
    takeLatest(GetChatInfo.action, GetChatInfo.saga),
    takeLatest(ChangeSelectedChat.action, ChangeSelectedChat.saga),
    takeLatest(EditGroupChat.action, EditGroupChat.saga),
    takeEvery(UploadAttachmentRequest.action, UploadAttachmentRequest.saga),
    takeEvery(UploadAttachmentSuccess.action, UploadAttachmentSuccess.saga),
    takeEvery(RemoveAttachment.action, RemoveAttachment.saga),
    takeLeading(MessageTyping.action, MessageTyping.saga),
    takeLeading(GetMessages.action, GetMessages.saga),
    takeLatest(ClearChatHistory.action, ClearChatHistory.saga),
    takeEvery(CreateMessage.action, CreateMessage.saga),
    takeEvery(CopyMessages.action, CopyMessages.saga),
    takeEvery(SubmitEditMessage.action, SubmitEditMessage.saga),
    takeEvery(DeleteMessage.action, DeleteMessage.saga),
    takeEvery(ForwardMessages.action, ForwardMessages.saga),
    takeEvery(RemoveAllAttachments.action, RemoveAllAttachments.saga),
    takeEvery(RemoveUserFromGroupChat.action, RemoveUserFromGroupChat.saga),
    takeEvery(RemoveChat.action, RemoveChat.saga),
    takeEvery(UploadVoiceAttachment.action, UploadVoiceAttachment.saga),
    takeEvery(CreateMessageSuccess.action, CreateMessageSuccess.saga),

    // socket-events
    takeEvery(MessageCreatedEventHandler.action, MessageCreatedEventHandler.saga),
    takeEvery(
      MessagesDeletedIntegrationEventHandler.action,
      MessagesDeletedIntegrationEventHandler.saga,
    ),
    takeLatest(UserMessageTypingEventHandler.action, UserMessageTypingEventHandler.saga),
  ]);
}
