import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { AddUsersToGroupChatSuccess } from './features/add-users-to-group-chat/add-users-to-group-chat-success';
import { ChangeChatMutedStatusSuccess } from './features/change-chat-muted-status/change-chat-muted-status-success';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { CreateChat } from './features/create-chat/create-chat';
import { CreateGroupChatSuccess } from './features/create-group-chat/create-group-chat-success';
import { CreateMessage } from './features/create-message/create-message';
import { DeleteMessageSuccess } from './features/delete-message/delete-message-success';
import { EditGroupChatSuccess } from './features/edit-group-chat/edit-group-chat-success';
import { EditMessage } from './features/edit-message/edit-message';
import { ResetEditMessage } from './features/edit-message/reset-edit-message';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { SubmitEditMessageSuccess } from './features/edit-message/sumbit-edit-message-success';
import { GetAudioAttachmentsSuccess } from './features/get-audio-attachments/get-audio-attachments-success';
import { GetChatInfoSuccess } from './features/get-chat-info/get-chat-info-success';
import { GetChats } from './features/get-chats/get-chats';
import { GetChatsFailure } from './features/get-chats/get-chats-failure';
import { GetChatsSuccess } from './features/get-chats/get-chats-success';
import { GetGroupChatUsers } from './features/get-group-chat-users/get-group-chat-users';
import { GetGroupChatUsersSuccess } from './features/get-group-chat-users/get-group-chat-users-success';
import { GetMessages } from './features/get-messages/get-messages';
import { GetMessagesFailure } from './features/get-messages/get-messages-failure';
import { GetMessagesSuccess } from './features/get-messages/get-messages-success';
import { GetPhotoAttachments } from './features/get-photo-attachments/get-photo-attachments';
import { GetPhotoAttachmentsSuccess } from './features/get-photo-attachments/get-photo-attachments-success';
import { GetRawAttachments } from './features/get-raw-attachments/get-raw-attachments';
import { GetRawAttachmentsSuccess } from './features/get-raw-attachments/get-raw-attachments-success';
import { GetVideoAttachments } from './features/get-video-attachments/get-video-attachments';
import { GetVideoAttachmentsSuccess } from './features/get-video-attachments/get-video-attachments-success';
import { GetVoiceAttachments } from './features/get-voice-attachments/get-voice-attachments';
import { GetVoiceAttachmentsSuccess } from './features/get-voice-attachments/get-voice-attachments-success';
import { InterlocutorStoppedTyping } from './features/interlocutor-message-typing/interlocutor-stopped-typing';
import { LeaveGroupChatSuccess } from './features/leave-group-chat/leave-group-chat-success';
import { MarkMessagesAsReadSuccess } from './features/mark-messages-as-read/mark-messages-as-read-success';
import { MessageTyping } from './features/message-typing/message-typing';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { ReplyToMessage } from './features/reply-to-message/reply-to-message';
import { ResetReplyToMessage } from './features/reply-to-message/reset-reply-to-message';
import { ResetSelectedMessages } from './features/select-message/reset-selected-messages';
import { SelectMessage } from './features/select-message/select-message';
import { UploadAttachmentFailure } from './features/upload-attachment/upload-attachment-failure';
import { UploadAttachmentProgress } from './features/upload-attachment/upload-attachment-progress';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';
import { UploadAttachmentSuccess } from './features/upload-attachment/upload-attachment-success';
import { UnshiftChat } from './features/unshift-chat/unshift-chat';
import { getChatByIdDraftSelector } from './selectors';
import { ClearChatHistorySuccess } from './features/clear-chat-history/clear-chat-history-success';
import { GroupChatCreatedEventHandler } from './socket-events/group-chat-created/group-chat-created-event-handler';
import { GroupChatEditedEventHandler } from './socket-events/group-chat-edited/group-chat-edited-integration-event-handler';
import { MemberLeftGroupChatEventHandler } from './socket-events/member-left-group-chat/member-left-group-chat-event-handler';
import { MessageEditedEventHandler } from './socket-events/message-edited/message-edited-event-handler';
import { UserMessageTypingEventHandler } from './socket-events/message-typing/message-typing-event-handler';
import { MessageReadEventHandler } from './socket-events/message-read/message-read-event-handler';
import { ChatClearedEventHandler } from './socket-events/chat-cleared/chat-cleared-event-handler';
import { ForwardMessages } from './features/forward-messages/forward-messages';
import { CreateMessageSuccess } from './features/create-message/create-message-success';
import { ChatMutedStatusChangedEventHandler } from './socket-events/chat-mute-status-changed/chat-mute-status-changed-event-handler';
import { UserStatusChangedEventHandler } from '../friends/socket-events/user-status-changed/user-status-changed-event-handler';
import { ChatId } from './chat-id';
import { IChatsState } from './chats-state';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';
import { ChangeChatInfoOpened } from './features/change-chat-info-opened/change-chat-info-opened';
import { MessagesDeletedIntegrationEventHandlerSuccess } from './socket-events/message-deleted/messages-deleted-integration-event-handler-success';
import { RemoveAllAttachments } from './features/remove-attachment/remove-all-attachments';

const initialState: IChatsState = {
  hasMore: true,
  searchString: '',
  chats: [],
  messages: {},
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
  .handleAction(RemoveAllAttachments.action, RemoveAllAttachments.reducer)
  .handleAction(ForwardMessages.action, ForwardMessages.reducer)
  .handleAction(
    UserStatusChangedEventHandler.action,
    produce(
      (
        draft: IChatsState,
        { payload }: ReturnType<typeof UserStatusChangedEventHandler.action>,
      ) => {
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
      },
    ),
  )

  // socket-events
  .handleAction(UserMessageTypingEventHandler.action, UserMessageTypingEventHandler.reducer)
  .handleAction(MemberLeftGroupChatEventHandler.action, MemberLeftGroupChatEventHandler.reducer)
  .handleAction(GroupChatEditedEventHandler.action, GroupChatEditedEventHandler.reducer)
  .handleAction(GroupChatCreatedEventHandler.action, GroupChatCreatedEventHandler.reducer)
  .handleAction(
    ChatMutedStatusChangedEventHandler.action,
    ChatMutedStatusChangedEventHandler.reducer,
  )
  .handleAction(MessageEditedEventHandler.action, MessageEditedEventHandler.reducer)
  .handleAction(MessageReadEventHandler.action, MessageReadEventHandler.reducer)
  .handleAction(ChatClearedEventHandler.action, ChatClearedEventHandler.reducer)
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer)
  .handleAction(
    MessagesDeletedIntegrationEventHandlerSuccess.action,
    MessagesDeletedIntegrationEventHandlerSuccess.reducer,
  );

export default chats;
