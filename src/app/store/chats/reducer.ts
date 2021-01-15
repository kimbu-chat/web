import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { AddUsersToGroupChatSuccess } from 'store/chats/features/add-users-to-group-chat/add-users-to-group-chat-success';
import { ChangeChatMutedStatusSuccess } from 'store/chats/features/change-chat-muted-status/change-chat-muted-status-success';
import { ChangeSelectedChat } from 'store/chats/features/change-selected-chat/change-selected-chat';
import { CreateChat } from 'store/chats/features/create-chat/create-chat';
import { CreateGroupChatSuccess } from 'store/chats/features/create-group-chat/create-group-chat-success';
import { CreateMessage } from 'store/chats/features/create-message/create-message';
import { CreateMessageSuccess } from 'store/chats/features/create-message/create-message-success';
import { DeleteMessageSuccess } from 'store/chats/features/delete-message/delete-message-success';
import { EditGroupChatSuccess } from 'store/chats/features/edit-group-chat/edit-group-chat-success';
import { EditMessage } from 'store/chats/features/edit-message/edit-message';
import { ResetEditMessage } from 'store/chats/features/edit-message/reset-edit-message';
import { SubmitEditMessage } from 'store/chats/features/edit-message/submit-edit-message';
import { SubmitEditMessageSuccess } from 'store/chats/features/edit-message/sumbit-edit-message-success';
import { GetAudioAttachmentsSuccess } from 'store/chats/features/get-audio-attachments/get-audio-attachments-success';
import { GetChatInfoSuccess } from 'store/chats/features/get-chat-info/get-chat-info-success';
import { GetChats } from 'store/chats/features/get-chats/get-chats';
import { GetChatsFailure } from 'store/chats/features/get-chats/get-chats-failure';
import { GetChatsSuccess } from 'app/store/chats/features/get-chats/get-chats-success';
import { GetGroupChatUsers } from 'store/chats/features/get-group-chat-users/get-group-chat-users';
import { GetGroupChatUsersSuccess } from 'store/chats/features/get-group-chat-users/get-group-chat-users-success';
import { GetMessages } from 'store/chats/features/get-messages/get-messages';
import { GetMessagesFailure } from 'store/chats/features/get-messages/get-messages-failure';
import { GetMessagesSuccess } from 'store/chats/features/get-messages/get-messages-success';
import { GetPhotoAttachments } from 'store/chats/features/get-photo-attachments/get-photo-attachments';
import { GetPhotoAttachmentsSuccess } from 'store/chats/features/get-photo-attachments/get-photo-attachments-success';
import { GetRawAttachments } from 'store/chats/features/get-raw-attachments/get-raw-attachments';
import { GetRawAttachmentsSuccess } from 'store/chats/features/get-raw-attachments/get-raw-attachments-success';
import { GetVideoAttachments } from 'store/chats/features/get-video-attachments/get-video-attachments';
import { GetVideoAttachmentsSuccess } from 'store/chats/features/get-video-attachments/get-video-attachments-success';
import { GetVoiceAttachments } from 'store/chats/features/get-voice-attachments/get-voice-attachments';
import { GetVoiceAttachmentsSuccess } from 'store/chats/features/get-voice-attachments/get-voice-attachments-success';
import { InterlocutorStoppedTyping } from 'store/chats/features/interlocutor-message-typing/interlocutor-stopped-typing';
import { LeaveGroupChatSuccess } from 'store/chats/features/leave-group-chat/leave-group-chat-success';
import { MarkMessagesAsReadSuccess } from 'store/chats/features/mark-messages-as-read/mark-messages-as-read-success';
import { MessageTyping } from 'store/chats/features/message-typing/message-typing';
import { RemoveAttachment } from 'store/chats/features/remove-attachment/remove-attachment';
import { ReplyToMessage } from 'store/chats/features/reply-to-message/reply-to-message';
import { ResetReplyToMessage } from 'store/chats/features/reply-to-message/reset-reply-to-message';
import { ResetSelectedMessages } from 'store/chats/features/select-message/reset-selected-messages';
import { SelectMessage } from 'store/chats/features/select-message/select-message';
import { UnshiftChat } from 'store/chats/features/unshift-chat/unshift-chat';
import { UploadAttachmentFailure } from 'store/chats/features/upload-attachment/upload-attachment-failure';
import { UploadAttachmentProgress } from 'store/chats/features/upload-attachment/upload-attachment-progress';
import { UploadAttachmentRequest } from 'store/chats/features/upload-attachment/upload-attachment-request';
import { UploadAttachmentSuccess } from 'store/chats/features/upload-attachment/upload-attachment-success';
import { getChatByIdDraftSelector } from 'store/chats/selectors';
import { ClearChatHistorySuccess } from 'app/store/chats/features/clear-chat-history/clear-chat-history-success';
import { GroupChatCreatedEventHandler } from 'store/chats/socket-events/group-chat-created/group-chat-created-event-handler';
import { GroupChatEditedEventHandler } from 'store/chats/socket-events/group-chat-edited/group-chat-edited-integration-event-handler';
import { MemberLeftGroupChatEventHandler } from 'store/chats/socket-events/member-left-group-chat/member-left-group-chat-event-handler';
import { MessagesDeletedIntegrationEventHandler } from 'store/chats/socket-events/message-deleted/messages-deleted-integration-event-handler';
import { MessageEditedEventHandler } from 'store/chats/socket-events/message-edited/message-edited-event-handler';
import { UserMessageTypingEventHandler } from 'store/chats/socket-events/message-typing/message-typing-event-handler';
import { MessageReadEventHandler } from 'store/chats/socket-events/message-read/message-read-event-handler';
import { ChatClearedEventHandler } from 'store/chats/socket-events/chat-cleared/chat-cleared-event-handler';
import { ForwardMessages } from 'store/chats/features/forward-messages/forward-messages';
import { ChatMutedStatusChangedEventHandler } from './socket-events/chat-mute-status-changed/chat-mute-status-changed-event-handler';
import { UserStatusChangedEventHandler } from '../friends/socket-events/user-status-changed/user-status-changed-event-handler';
import { ChatId } from './chat-id';
import { IChatsState } from './models/chats-state';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { ChangeChatInfoOpened } from './features/change-chat-info-opened/change-chat-info-opened';

const initialState: IChatsState = {
  hasMore: true,
  searchString: '',
  chats: [],
  searchChats: [],
  selectedChatId: null,
  selectedMessageIds: [],
  page: -1,
  searchPage: 0,
  isInfoOpened: false,
};

const chats = createReducer<IChatsState>(initialState)
  .handleAction(InterlocutorStoppedTyping.action, InterlocutorStoppedTyping.reducer)
  .handleAction(CreateGroupChatSuccess.action, CreateGroupChatSuccess.reducer)
  .handleAction(AddUsersToGroupChatSuccess.action, AddUsersToGroupChatSuccess.reducer)
  .handleAction(ChangeChatMutedStatusSuccess.action, ChangeChatMutedStatusSuccess.reducer)
  .handleAction(ChangeSelectedChat.action, ChangeSelectedChat.reducer)
  .handleAction(GetChats.action, GetChats.reducer)
  .handleAction(GetChatsSuccess.action, GetChatsSuccess.reducer)
  .handleAction(GetChatsFailure.action, GetChatsFailure.reducer)
  .handleAction(LeaveGroupChatSuccess.action, LeaveGroupChatSuccess.reducer)
  .handleAction(MarkMessagesAsReadSuccess.action, MarkMessagesAsReadSuccess.reducer)
  .handleAction(CreateChat.action, CreateChat.reducer)
  .handleAction(GetPhotoAttachmentsSuccess.action, GetPhotoAttachmentsSuccess.reducer)
  .handleAction(GetVoiceAttachmentsSuccess.action, GetVoiceAttachmentsSuccess.reducer)
  .handleAction(GetRawAttachmentsSuccess.action, GetRawAttachmentsSuccess.reducer)
  .handleAction(GetRawAttachments.action, GetRawAttachments.reducer)
  .handleAction(GetPhotoAttachments.action, GetPhotoAttachments.reducer)
  .handleAction(GetAudioAttachmentsSuccess.action, GetAudioAttachmentsSuccess.reducer)
  .handleAction(UploadAttachmentRequest.action, UploadAttachmentRequest.reducer)
  .handleAction(UploadAttachmentProgress.action, UploadAttachmentProgress.reducer)
  .handleAction(UploadAttachmentSuccess.action, UploadAttachmentSuccess.reducer)
  .handleAction(UploadAttachmentFailure.action, UploadAttachmentFailure.reducer)
  .handleAction(RemoveAttachment.action, RemoveAttachment.reducer)
  .handleAction(GetChatInfoSuccess.action, GetChatInfoSuccess.reducer)
  .handleAction(EditGroupChatSuccess.action, EditGroupChatSuccess.reducer)
  .handleAction(GetGroupChatUsers.action, GetGroupChatUsers.reducer)
  .handleAction(GetGroupChatUsersSuccess.action, GetGroupChatUsersSuccess.reducer)
  .handleAction(GetVoiceAttachments.action, GetVoiceAttachments.reducer)
  .handleAction(GetVideoAttachments.action, GetVideoAttachments.reducer)
  .handleAction(GetVideoAttachmentsSuccess.action, GetVideoAttachmentsSuccess.reducer)
  .handleAction(CreateMessageSuccess.action, CreateMessageSuccess.reducer)
  .handleAction(GetMessages.action, GetMessages.reducer)
  .handleAction(GetMessagesSuccess.action, GetMessagesSuccess.reducer)
  .handleAction(GetMessagesFailure.action, GetMessagesFailure.reducer)
  .handleAction(CreateMessage.action, CreateMessage.reducer)
  .handleAction(DeleteMessageSuccess.action, DeleteMessageSuccess.reducer)
  .handleAction(SelectMessage.action, SelectMessage.reducer)
  .handleAction(ResetSelectedMessages.action, ResetSelectedMessages.reducer)
  .handleAction(ReplyToMessage.action, ReplyToMessage.reducer)
  .handleAction(EditMessage.action, EditMessage.reducer)
  .handleAction(SubmitEditMessage.action, SubmitEditMessage.reducer)
  .handleAction(SubmitEditMessageSuccess.action, SubmitEditMessageSuccess.reducer)
  .handleAction(ResetReplyToMessage.action, ResetReplyToMessage.reducer)
  .handleAction(ResetEditMessage.action, ResetEditMessage.reducer)
  .handleAction(ClearChatHistorySuccess.action, ClearChatHistorySuccess.reducer)
  .handleAction(UnshiftChat.action, UnshiftChat.reducer)
  .handleAction(MessageTyping.action, MessageTyping.reducer)
  .handleAction(ChangeChatInfoOpened.action, ChangeChatInfoOpened.reducer)
  .handleAction(
    UserStatusChangedEventHandler.action,
    produce((draft: IChatsState, { payload }: ReturnType<typeof UserStatusChangedEventHandler.action>) => {
      const { status, userId } = payload;
      const chatId: number = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      if (chat.interlocutor) {
        const { interlocutor } = chat;
        interlocutor.status = status;
        interlocutor.lastOnlineTime = new Date();
      }

      return draft;
    }),
  )

  // socket-events

  .handleAction(UserMessageTypingEventHandler.action, UserMessageTypingEventHandler.reducer)
  .handleAction(MemberLeftGroupChatEventHandler.action, MemberLeftGroupChatEventHandler.reducer)
  .handleAction(GroupChatEditedEventHandler.action, GroupChatEditedEventHandler.reducer)
  .handleAction(GroupChatCreatedEventHandler.action, GroupChatCreatedEventHandler.reducer)
  .handleAction(ChatMutedStatusChangedEventHandler.action, ChatMutedStatusChangedEventHandler.reducer)
  .handleAction(MessageEditedEventHandler.action, MessageEditedEventHandler.reducer)
  .handleAction(MessagesDeletedIntegrationEventHandler.action, MessagesDeletedIntegrationEventHandler.reducer)
  .handleAction(MessageReadEventHandler.action, MessageReadEventHandler.reducer)
  .handleAction(ChatClearedEventHandler.action, ChatClearedEventHandler.reducer)
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer)
  .handleAction(ForwardMessages.action, ForwardMessages.reducer);

export default chats;
