import { takeEvery, takeLatest } from 'redux-saga/effects';
import { CreateGroupChat } from './features/create-group-chat/create-group-chat';
import { AddUsersToGroupChat } from './features/add-users-to-group-chat/add-users-to-group-chat';
import { ChangeChatVisibilityState } from './features/change-chat-visibility-state/change-chat-visibility-state';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { CreateGroupChatFromEvent } from './features/create-group-chat/create-group-chat-from-event';
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
import { MuteChat } from './features/mute-chat/mute-chat';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';

export const ChatSagas = [
  takeLatest(GetChats.action, GetChats.saga),
  takeLatest(LeaveGroupChat.action, LeaveGroupChat.saga),
  takeLatest(GetGroupChatUsers.action, GetGroupChatUsers.saga),
  takeLatest(CreateGroupChatFromEvent.action, CreateGroupChatFromEvent.saga),
  takeLatest(CreateGroupChat.action, CreateGroupChat.saga),
  takeLatest(ChangeChatVisibilityState.action, ChangeChatVisibilityState.saga),
  takeLatest(AddUsersToGroupChat.action, AddUsersToGroupChat.saga),
  takeLatest(MuteChat.action, MuteChat.saga),
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
];
