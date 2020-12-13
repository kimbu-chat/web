import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { AudioAttachment, PictureAttachment, RawAttachment, VideoAttachment, VoiceAttachment, ChatsState } from './models';
import { ChatId } from './chat-id';
import { MessageActions } from '../messages/actions';
import { FriendActions } from '../friends/actions';
import { FileType } from '../messages/models';
import { UserStatusChangedEvent } from '../friends/features/user-status-changed-event/user-status-changed-event';
import { CreateChat } from './features/create-chat/create-chat';
import { CreateMessage } from '../messages/features/create-message/create-message';
import { CreateMessageSuccess } from '../messages/features/create-message/create-message-success';
import { getChatArrayIndex, checkChatExists } from './chats-utils';
import { AddUsersToGroupChatSuccess } from './features/add-users-to-group-chat/add-users-to-group-chat-success';
import { ChangeChatVisibilityStateSuccess } from './features/change-chat-visibility-state/change-chat-visibility-state-success';
import { ChangeInterlocutorLastReadMessageId } from './features/change-intelocutor-last-read-message-id/change-interlocutor-last-read-message-id';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { CreateGroupChatSuccess } from './features/create-group-chat/create-group-chat-success';
import { EditGroupChatSuccess } from './features/edit-group-chat/edit-group-chat-success';
import { GetAudioAttachmentsSuccess } from './features/get-audio-attachments/get-audio-attachments-success';
import { GetChatInfoSuccess } from './features/get-chat-info/get-chat-info-success';
import { GetChats } from './features/get-chats/get-chats';
import { GetChatsFailure } from './features/get-chats/get-chats-failure';
import { GetChatsSuccess } from './features/get-chats/get-chats-success';
import { GetPhotoAttachmentsSuccess } from './features/get-photo-attachments/get-photo-attachments-success';
import { GetRawAttachmentsSuccess } from './features/get-raw-attachments/get-raw-attachments-success';
import { GetVoiceAttachmentsSuccess } from './features/get-voice-attachments/get-voice-attachments-success';
import { InterlocutorMessageTyping } from './features/interlocutor-message-typing/interlocutor-message-typing';
import { InterlocutorStoppedTyping } from './features/interlocutor-message-typing/interlocutor-stopped-typing';
import { LeaveGroupChatSuccess } from './features/leave-group-chat/leave-group-chat-success';
import { MarkMessagesAsRead } from './features/mark-messages-as-read/mark-messages-as-read';
import { MuteChatSuccess } from './features/mute-chat/mute-chat-success';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { UnshiftChat } from './features/unshift-chat/unshift-chat';
import { UploadAttachmentFailure } from './features/upload-attachment/upload-attachment-failure';
import { UploadAttachmentProgress } from './features/upload-attachment/upload-attachment-progress';
import { UploadAttachmentRequest } from './features/upload-attachment/upload-attachment-request';
import { UploadAttachmentSuccess } from './features/upload-attachment/upload-attachment-success';
import { MessageTyping } from '../messages/features/message-typing/message-typing';
import { SubmitEditMessage } from '../messages/features/edit-message/submit-edit-message';
import { GetGroupChatUsers } from './features/get-group-chat-users/get-group-chat-users';
import { GetGroupChatUsersSuccess } from './features/get-group-chat-users/get-group-chat-users-success';
import { ChangeLastMessage } from './features/change-last-message/change-last-message';
import { GetVoiceAttachments } from './features/get-voice-attachments/get-voice-attachments';
import { GetVideoAttachments } from './features/get-video-attachments/get-video-attachments';
import { GetRawAttachments } from './features/get-raw-attachments/get-raw-attachments';
import { GetPhotoAttachments } from './features/get-photo-attachments/get-photo-attachments';
import { GetVideoAttachmentsSuccess } from './features/get-video-attachments/get-video-attachments-success';

const initialState: ChatsState = {
  loading: false,
  hasMore: true,
  searchString: '',
  chats: [],
};

const chats = createReducer<ChatsState>(initialState)
  .handleAction(InterlocutorStoppedTyping.action, InterlocutorStoppedTyping.reducer)
  .handleAction(InterlocutorMessageTyping.action, InterlocutorMessageTyping.reducer)
  .handleAction(CreateGroupChatSuccess.action, CreateGroupChatSuccess.reducer)
  .handleAction(AddUsersToGroupChatSuccess.action, AddUsersToGroupChatSuccess.reducer)
  .handleAction(MuteChatSuccess.action, MuteChatSuccess.reducer)
  .handleAction(ChangeSelectedChat.action, ChangeSelectedChat.reducer)
  .handleAction(GetChats.action, GetChats.reducer)
  .handleAction(GetChatsSuccess.action, GetChatsSuccess.reducer)
  .handleAction(GetChatsFailure.action, GetChatsFailure.reducer)
  .handleAction(LeaveGroupChatSuccess.action, LeaveGroupChatSuccess.reducer)
  .handleAction(ChangeChatVisibilityStateSuccess.action, ChangeChatVisibilityStateSuccess.reducer)
  .handleAction(MarkMessagesAsRead.action, MarkMessagesAsRead.reducer)
  .handleAction(ChangeInterlocutorLastReadMessageId.action, ChangeInterlocutorLastReadMessageId.reducer)
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
  .handleAction(ChangeLastMessage.action, ChangeLastMessage.reducer)
  .handleAction(GetVoiceAttachments.action, GetVoiceAttachments.reducer)
  .handleAction(GetVideoAttachments.action, GetVideoAttachments.reducer)
  .handleAction(GetVideoAttachmentsSuccess.action, GetVideoAttachmentsSuccess.reducer)
  .handleAction(
    MessageActions.clearChatHistorySuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.clearChatHistorySuccess>) => {
      const { chatId } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].lastMessage = null;
      }

      return draft;
    }),
  )
  .handleAction(
    CreateMessage.action,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createMessage>) => {
      const { message, chatId, currentUserId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      const isCurrentUserMessageCreator: boolean = currentUserId === message.userCreator?.id;

      // if user already has chats with interlocutor - update chat
      if (chatIndex >= 0) {
        const isInterlocutorCurrentSelectedChat: boolean = draft.selectedChatId === chatId;
        const previousUnreadMessagesCount = draft.chats[chatIndex].unreadMessagesCount || 0;
        const unreadMessagesCount =
          isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator ? previousUnreadMessagesCount : previousUnreadMessagesCount + 1;

        draft.chats[chatIndex].attachmentsToSend = [];
        draft.chats[chatIndex].lastMessage = { ...message };
        draft.chats[chatIndex].unreadMessagesCount = unreadMessagesCount;
        draft.chats[chatIndex].draftMessage = '';

        const chatWithNewMessage = draft.chats[chatIndex];

        draft.chats.splice(chatIndex, 1);

        draft.chats.unshift(chatWithNewMessage);
      }
      return draft;
    }),
  )
  .handleAction(
    UserStatusChangedEvent.action,
    produce((draft: ChatsState, { payload }: ReturnType<typeof FriendActions.userStatusChangedEvent>) => {
      const { status, userId } = payload;
      const chatId: number = new ChatId().From(userId).entireId;
      const isChatExists = checkChatExists(chatId, draft);
      const chatIndex = getChatArrayIndex(chatId, draft);

      if (!isChatExists) {
        return draft;
      }

      const interlocutor = draft.chats[chatIndex].interlocutor!;
      interlocutor.status = status;
      interlocutor.lastOnlineTime = new Date();
      return draft;
    }),
  )
  .handleAction(
    CreateMessageSuccess.action,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createMessageSuccess>) => {
      const { messageState, chatId, oldMessageId, newMessageId, attachments } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (draft.chats[chatIndex].lastMessage?.id === oldMessageId) {
          const lastMessage = draft.chats[chatIndex].lastMessage || { id: 0, state: '' };

          lastMessage.id = newMessageId;

          lastMessage.state = messageState;
        }

        attachments?.forEach((attachment) => {
          switch (attachment.type) {
            case FileType.audio:
              draft.chats[chatIndex].audioAttachmentsCount = (draft.chats[chatIndex].audioAttachmentsCount || 0) + 1;
              draft.chats[chatIndex].audios.audios.unshift({
                ...(attachment as AudioAttachment),
                creationDateTime: new Date(),
              });

              break;
            case FileType.picture:
              draft.chats[chatIndex].pictureAttachmentsCount = (draft.chats[chatIndex].pictureAttachmentsCount || 0) + 1;
              draft.chats[chatIndex].photos.photos.unshift({
                ...(attachment as PictureAttachment),
                creationDateTime: new Date(),
              });

              break;
            case FileType.raw:
              draft.chats[chatIndex].rawAttachmentsCount = (draft.chats[chatIndex].rawAttachmentsCount || 0) + 1;
              draft.chats[chatIndex].files.files.unshift({
                ...(attachment as RawAttachment),
                creationDateTime: new Date(),
              });

              break;
            case FileType.video:
              draft.chats[chatIndex].videoAttachmentsCount = (draft.chats[chatIndex].videoAttachmentsCount || 0) + 1;
              draft.chats[chatIndex].videos.videos.unshift({
                ...(attachment as VideoAttachment),
                creationDateTime: new Date(),
              });

              break;
            case FileType.voice:
              draft.chats[chatIndex].voiceAttachmentsCount = (draft.chats[chatIndex].voiceAttachmentsCount || 0) + 1;
              draft.chats[chatIndex].recordings.recordings.unshift({
                ...(attachment as VoiceAttachment),
                creationDateTime: new Date(),
              });

              break;
            default:
              break;
          }
        });
      }

      return draft;
    }),
  )
  .handleAction(
    SubmitEditMessage.action,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.submitEditMessage>) => {
      const { chatId, messageId, text } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].attachmentsToSend = [];

        if (draft.chats[chatIndex].lastMessage?.id === messageId) {
          draft.chats[chatIndex].lastMessage!.text = text;
        }
      }

      return draft;
    }),
  )
  .handleAction(
    MessageTyping.action,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.messageTyping>) => {
      const { chatId, text } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].draftMessage = text;
      }

      return draft;
    }),
  )
  .handleAction(UnshiftChat.action, UnshiftChat.reducer);

export default chats;
