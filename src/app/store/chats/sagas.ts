import { takeEvery, takeLatest } from 'redux-saga/effects';
import { CreateGroupChat } from './features/create-group-chat/create-group-chat';
import { AddUsersToGroupChat } from './features/add-users-to-group-chat/add-users-to-group-chat';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { EditGroupChat } from './features/edit-group-chat/edit-group-chat';
import { GetAudioAttachments } from './features/get-audio-attachments/get-audio-attachments';
import { GetChatInfo } from './features/get-chat-info/get-chat-info';
import { GetChats } from './features/get-chats/get-chats';
import { GetGroupChatUsers } from './features/get-group-chat-users/get-group-chat-users';
import { GetPhotoAttachments } from './features/get-photo-attachments/get-photo-attachments';
import { GetRawAttachments } from './features/get-raw-attachments/get-raw-attachments';
import { GetVideoAttachments } from './features/get-video-attachments/get-video-attachments';
import { GetVoiceAttachments } from './features/get-voice-attachments/get-voice-attachments';
import { LeaveGroupChat } from './features/leave-group-chat/leave-group-chat';
import { MarkMessagesAsRead } from './features/mark-messages-as-read/mark-messages-as-read';
import { ChangeChatMutedStatus } from './features/change-chat-muted-status/change-chat-muted-status';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';
import { CopyMessages } from './features/copy-messages/copy-messages';
import { CreateMessage } from './features/create-message/create-message';
import { DeleteMessage } from './features/delete-message/delete-message';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { GetMessages } from './features/get-messages/get-messages';
import { MessageTyping } from './features/message-typing/message-typing';
import { ClearChatHistory } from './features/clear-chat-history/clear-chat-history';
import { MessageCreatedEventHandler } from './socket-events/message-created/message-created-event-handler';
import { UserMessageTypingEventHandler } from './socket-events/message-typing/message-typing-event-handler';
import { ForwardMessages } from './features/forward-messages/forward-messages';

export const ChatSagas = [
  takeLatest(GetChats.action, GetChats.saga),
  takeLatest(LeaveGroupChat.action, LeaveGroupChat.saga),
  takeLatest(GetGroupChatUsers.action, GetGroupChatUsers.saga),
  takeLatest(CreateGroupChat.action, CreateGroupChat.saga),
  takeLatest(AddUsersToGroupChat.action, AddUsersToGroupChat.saga),
  takeLatest(ChangeChatMutedStatus.action, ChangeChatMutedStatus.saga),
  takeLatest(GetPhotoAttachments.action, GetPhotoAttachments.saga),
  takeLatest(GetVideoAttachments.action, GetVideoAttachments.saga),
  takeLatest(GetRawAttachments.action, GetRawAttachments.saga),
  takeLatest(GetVoiceAttachments.action, GetVoiceAttachments.saga),
  takeLatest(GetAudioAttachments.action, GetAudioAttachments.saga),
  takeLatest(MarkMessagesAsRead.action, MarkMessagesAsRead.saga),
  takeLatest(GetChatInfo.action, GetChatInfo.saga),
  takeLatest(ChangeSelectedChat.action, ChangeSelectedChat.saga),
  takeLatest(EditGroupChat.action, EditGroupChat.saga),
  takeEvery(UploadAttachmentRequest.action, UploadAttachmentRequest.saga),
  takeEvery(RemoveAttachment.action, RemoveAttachment.saga),
  takeLatest(MessageTyping.action, MessageTyping.saga),
  takeLatest(GetMessages.action, GetMessages.saga),
  takeLatest(ClearChatHistory.action, ClearChatHistory.saga),
  takeEvery(CreateMessage.action, CreateMessage.saga),
  takeEvery(CopyMessages.action, CopyMessages.saga),
  takeEvery(SubmitEditMessage.action, SubmitEditMessage.saga),
  takeEvery(DeleteMessage.action, DeleteMessage.saga),
  takeEvery(ForwardMessages.action, ForwardMessages.saga),

  // socket-events
  takeEvery(MessageCreatedEventHandler.action, MessageCreatedEventHandler.saga),
  takeLatest(UserMessageTypingEventHandler.action, UserMessageTypingEventHandler.saga),
];
