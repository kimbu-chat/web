import { createReducer } from '@reduxjs/toolkit';
import { SystemMessageType } from 'kimbu-models';

import { APPEARANCE_CHAT_ID } from '@common/constants';
import { MyProfileService } from '@services/my-profile-service';
import { CreateDraftMessage } from '@store/chats/features/create-draft-message/create-draft-message';
import { DiscardDraftMessage } from '@store/chats/features/create-draft-message/discard-draft-message';
import { MessageState, INormalizedChat } from '@store/chats/models';
import { DismissToAddContactSuccess } from '@store/friends/features/dismiss-to-add-contact/dismiss-to-add-contact-success';
import { UserContactAddedSuccessEventHandler } from '@store/friends/socket-events/user-contact-added/user-contact-added-success-event-handler';
import { UserContactsRemovedEventHandler } from '@store/friends/socket-events/user-contacts-removed/user-contacts-removed-event-handler';
import { GetMyProfileSuccess } from '@store/my-profile/features/get-my-profile/get-my-profile-success';
import { UserAddedToBlackListEventHandler } from '@store/settings/socket-events/user-added-to-black-list/user-added-to-black-list-event-handler';
import { UserRemovedFromBlackListEventHandler } from '@store/settings/socket-events/user-removed-from-black-list/user-removed-from-black-list-event-handler';

import { AddFriendSuccess } from '../friends/features/add-friend/add-friend-success';
import { DeleteFriendSuccess } from '../friends/features/delete-friend/delete-friend-success';
import { BlockUserSuccess } from '../settings/features/block-user/block-user-success';
import { UnblockUserSuccess } from '../settings/features/unblock-user/unblock-user-success';

import { ChatId } from './chat-id';
import { IChatsState } from './chats-state';
import { AddUsersToGroupChatSuccess } from './features/add-users-to-group-chat/add-users-to-group-chat-success';
import { ChangeChatInfoOpened } from './features/change-chat-info-opened/change-chat-info-opened';
import { ChangeChatMutedStatusSuccess } from './features/change-chat-muted-status/change-chat-muted-status-success';
import { ChangeSelectedChat } from './features/change-selected-chat/change-selected-chat';
import { ClearChatHistorySuccess } from './features/clear-chat-history/clear-chat-history-success';
import { CreateGroupChatSuccess } from './features/create-group-chat/create-group-chat-success';
import { CreateMessageSuccess } from './features/create-message/create-message-success';
import { CreateMessage } from './features/create-message/create-message';
import { DeleteMessageSuccess } from './features/delete-message/delete-message-success';
import { EditGroupChatSuccess } from './features/edit-group-chat/edit-group-chat-success';
import { EditMessage } from './features/edit-message/edit-message';
import { ResetEditMessage } from './features/edit-message/reset-edit-message';
import { SubmitEditMessage } from './features/edit-message/submit-edit-message';
import { SubmitEditMessageSuccess } from './features/edit-message/sumbit-edit-message-success';
import { ForwardMessages } from './features/forward-messages/forward-messages';
import { GetAudioAttachmentsSuccess } from './features/get-audio-attachments/get-audio-attachments-success';
import { GetChatInfoSuccess } from './features/get-chat-info/get-chat-info-success';
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
import { InterlocutorStoppedTyping } from './features/interlocutor-message-typing/interlocutor-stopped-typing';
import { LeaveGroupChatSuccess } from './features/leave-group-chat/leave-group-chat-success';
import { MarkChatAsReadSuccess } from './features/mark-chat-as-read/mark-chat-as-read-success';
import { MessageTyping } from './features/message-typing/message-typing';
import { RemoveAllAttachments } from './features/remove-attachment/remove-all-attachments';
import { RemoveAttachment } from './features/remove-attachment/remove-attachment';
import { RemoveChatSuccess } from './features/remove-chat/remove-chat-success';
import { RemoveChat } from './features/remove-chat/remove-chat';
import { RemoveUserFromGroupChatSuccess } from './features/remove-user-from-group-chat/remove-user-from-group-chat-success';
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
import { getChatByIdDraftSelector } from './selectors';
import { ChatClearedEventHandler } from './socket-events/chat-cleared/chat-cleared-event-handler';
import { ChatMutedStatusChangedEventHandler } from './socket-events/chat-mute-status-changed/chat-mute-status-changed-event-handler';
import { DialogRemovedEventHandler } from './socket-events/dialog-removed/dialog-removed-event-handler';
import { GroupChatCreatedEventHandler } from './socket-events/group-chat-created/group-chat-created-event-handler';
import { GroupChatEditedEventHandler } from './socket-events/group-chat-edited/group-chat-edited-integration-event-handler';
import { MemberLeftGroupChatEventHandler } from './socket-events/member-left-group-chat/member-left-group-chat-event-handler';
import { MemberRemovedFromGroupChatEventHandler } from './socket-events/member-removed-from-group-chat/member-removed-from-group-chat-event-handler';
import { MessageCreatedEventHandlerSuccess } from './socket-events/message-created/message-created-event-handler-success';
import { MessagesDeletedIntegrationEventHandlerSuccess } from './socket-events/message-deleted/messages-deleted-integration-event-handler-success';
import { MessageEditedEventHandler } from './socket-events/message-edited/message-edited-event-handler';
import { MessageReadEventHandler } from './socket-events/message-read/message-read-event-handler';
import { UserMessageTypingEventHandler } from './socket-events/message-typing/message-typing-event-handler';

const initialState: IChatsState = {
  chats: {},
  chatList: {
    hasMore: true,
    chatIds: [],
    page: -1,
  },
  searchChatList: {
    loading: false,
    hasMore: true,
    chatIds: [],
    page: 0,
  },
  selectedChatId: undefined,
  selectedMessageIds: [],
  chatInfo: { isInfoOpened: false },
};

const reducer = createReducer<IChatsState>(initialState, builder => 
  builder.addCase(InterlocutorStoppedTyping.action, InterlocutorStoppedTyping.reducer)
  .addCase(CreateGroupChatSuccess.action, CreateGroupChatSuccess.reducer)
  .addCase(AddUsersToGroupChatSuccess.action, AddUsersToGroupChatSuccess.reducer)
  .addCase(ChangeChatMutedStatusSuccess.action, ChangeChatMutedStatusSuccess.reducer)
  .addCase(ChangeSelectedChat.action, ChangeSelectedChat.reducer)
  .addCase(GetChats.action, GetChats.reducer)
  .addCase(GetChatsSuccess.action, GetChatsSuccess.reducer)
  .addCase(GetChatsFailure.action, GetChatsFailure.reducer)
  .addCase(LeaveGroupChatSuccess.action, LeaveGroupChatSuccess.reducer)
  .addCase(MarkChatAsReadSuccess.action, MarkChatAsReadSuccess.reducer)
  .addCase(GetPhotoAttachmentsSuccess.action, GetPhotoAttachmentsSuccess.reducer)
  .addCase(GetVoiceAttachmentsSuccess.action, GetVoiceAttachmentsSuccess.reducer)
  .addCase(GetRawAttachmentsSuccess.action, GetRawAttachmentsSuccess.reducer)
  .addCase(GetRawAttachments.action, GetRawAttachments.reducer)
  .addCase(GetPhotoAttachments.action, GetPhotoAttachments.reducer)
  .addCase(GetAudioAttachmentsSuccess.action, GetAudioAttachmentsSuccess.reducer)
  .addCase(UploadAttachmentRequest.action, UploadAttachmentRequest.reducer)
  .addCase(UploadAttachmentProgress.action, UploadAttachmentProgress.reducer)
  .addCase(UploadAttachmentSuccess.action, UploadAttachmentSuccess.reducer)
  .addCase(UploadAttachmentFailure.action, UploadAttachmentFailure.reducer)
  .addCase(RemoveAttachment.action, RemoveAttachment.reducer)
  .addCase(GetChatInfoSuccess.action, GetChatInfoSuccess.reducer)
  .addCase(EditGroupChatSuccess.action, EditGroupChatSuccess.reducer)
  .addCase(GetGroupChatUsers.action, GetGroupChatUsers.reducer)
  .addCase(GetGroupChatUsersSuccess.action, GetGroupChatUsersSuccess.reducer)
  .addCase(GetVoiceAttachments.action, GetVoiceAttachments.reducer)
  .addCase(GetVideoAttachments.action, GetVideoAttachments.reducer)
  .addCase(GetVideoAttachmentsSuccess.action, GetVideoAttachmentsSuccess.reducer)
  .addCase(CreateMessageSuccess.action, CreateMessageSuccess.reducer)
  .addCase(CreateDraftMessage.action, CreateDraftMessage.reducer)
  .addCase(DiscardDraftMessage.action, DiscardDraftMessage.reducer)
  .addCase(GetMessages.action, GetMessages.reducer)
  .addCase(GetMessagesSuccess.action, GetMessagesSuccess.reducer)
  .addCase(GetMessagesFailure.action, GetMessagesFailure.reducer)
  .addCase(CreateMessage.action, CreateMessage.reducer)
  .addCase(DeleteMessageSuccess.action, DeleteMessageSuccess.reducer)
  .addCase(SelectMessage.action, SelectMessage.reducer)
  .addCase(ResetSelectedMessages.action, ResetSelectedMessages.reducer)
  .addCase(ReplyToMessage.action, ReplyToMessage.reducer)
  .addCase(EditMessage.action, EditMessage.reducer)
  .addCase(SubmitEditMessage.action, SubmitEditMessage.reducer)
  .addCase(SubmitEditMessageSuccess.action, SubmitEditMessageSuccess.reducer)
  .addCase(ResetReplyToMessage.action, ResetReplyToMessage.reducer)
  .addCase(ResetEditMessage.action, ResetEditMessage.reducer)
  .addCase(ClearChatHistorySuccess.action, ClearChatHistorySuccess.reducer)
  .addCase(UnshiftChat.action, UnshiftChat.reducer)
  .addCase(MessageTyping.action, MessageTyping.reducer)
  .addCase(ChangeChatInfoOpened.action, ChangeChatInfoOpened.reducer)
  .addCase(RemoveAllAttachments.action, RemoveAllAttachments.reducer)
  .addCase(ForwardMessages.action, ForwardMessages.reducer)
  .addCase(RemoveUserFromGroupChatSuccess.action, RemoveUserFromGroupChatSuccess.reducer)
  .addCase(RemoveChatSuccess.action, RemoveChatSuccess.reducer)

  .addCase(ResetSearchChats.action, ResetSearchChats.reducer)
  .addCase(RemoveChat.action, RemoveChat.reducer)
  .addCase(UploadVoiceAttachment.action, UploadVoiceAttachment.reducer)
  .addCase(UploadVoiceAttachmentSuccess.action, UploadVoiceAttachmentSuccess.reducer)
  .addCase(
    BlockUserSuccess.action,
    (draft, { payload }: ReturnType<typeof BlockUserSuccess.action>) => {
      const userId = payload;
      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      chat.isBlockedByUser = true;

      return draft;
    },
  )
  .addCase(
    UnblockUserSuccess.action,
    (draft: IChatsState, { payload }: ReturnType<typeof UnblockUserSuccess.action>) => {
      const userId = payload;
      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      chat.isBlockedByUser = false;

      return draft;
    },
  )

  .addCase(
    DeleteFriendSuccess.action,
    (draft: IChatsState, { payload }: ReturnType<typeof DeleteFriendSuccess.action>) => {
      const userId = payload;

      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.isInContacts = false;
      }

      return draft;
    },
  )

  .addCase(
    AddFriendSuccess.action,
    (draft: IChatsState, { payload }: ReturnType<typeof AddFriendSuccess.action>) => {
      const userId = payload;
      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      chat.isInContacts = true;

      return draft;
    },
  )
  .addCase(
    DismissToAddContactSuccess.action,
    (draft: IChatsState, { payload }: ReturnType<typeof DismissToAddContactSuccess.action>) => {
        const chatId: number = ChatId.from(payload).id;
        const chat = getChatByIdDraftSelector(chatId, draft);

        if (!chat) {
          return draft;
        }

        chat.isDismissedAddToContacts = true;

        return draft;
      }
  )
  .addCase(
    GetMyProfileSuccess.action,
    (draft: IChatsState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => {
      const currentUserId = payload.id;
      draft.chats[APPEARANCE_CHAT_ID] = {
        messages: {
          messages: {
            [-1]: {
              id: -1,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T13:50:11.5995892'),
              text: 'Hello',
              systemMessageType: SystemMessageType.None,
              state: MessageState.READ,
              chatId: -1,
              isEdited: true,
            },
            [-2]: {
              id: -2,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T13:51:11.3543574'),
              text: 'Hi, friend!',
              systemMessageType: SystemMessageType.None,
              state: MessageState.READ,
              chatId: -1,
            },
            [-3]: {
              id: -3,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T14:28:11.137058'),
              text: 'How are you?',
              systemMessageType: SystemMessageType.None,
              state: MessageState.READ,
              chatId: -1,
              isEdited: true,
            },
            [-4]: {
              id: -4,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T15:58:10.9164275'),
              text: 'You know, I am great!',
              systemMessageType: SystemMessageType.None,
              state: MessageState.READ,
              chatId: -1,
              isEdited: true,
            },
            [-5]: {
              id: -5,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T16:08:10.7092581'),
              text: 'So, I am happy for you',
              systemMessageType: SystemMessageType.None,
              state: MessageState.READ,
              chatId: -1,
            },
            [-6]: {
              id: -6,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T17:11:10.4607332'),
              text: 'What kind of plans do you have for tomorrow?',
              systemMessageType: SystemMessageType.None,
              state: MessageState.READ,
              chatId: -1,
            },
            [-7]: {
              id: -7,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T17:22:10.1117228'),
              text: 'Swimming, running, doing sports',
              systemMessageType: SystemMessageType.None,
              state: MessageState.READ,
              chatId: -1,
              isEdited: true,
            },
            [-8]: {
              id: -8,
              userCreatorId: currentUserId,
              creationDateTime: new Date('2021-05-04T22:35:09.7422384'),
              text: 'Can I make a company for you?',
              systemMessageType: SystemMessageType.None,
              state: MessageState.SENT,
              chatId: -1,
            },
            [-9]: {
              id: -9,
              userCreatorId: currentUserId,
              creationDateTime: new Date(),
              text: 'I will be happy for such a company!',
              systemMessageType: SystemMessageType.None,
              state: MessageState.QUEUED,
              chatId: -1,
            },
          },
        },
      } as unknown as INormalizedChat;
      return draft;
    },
  )

  // socket-events
  .addCase(MessageCreatedEventHandlerSuccess.action, MessageCreatedEventHandlerSuccess.reducer)
  .addCase(DialogRemovedEventHandler.action, DialogRemovedEventHandler.reducer)
  .addCase(
    UserAddedToBlackListEventHandler.action,
    (draft, { payload }: ReturnType<typeof UserAddedToBlackListEventHandler.action>) => {
      const { userInitiatorId, blockedUserId } = payload;
      const myId = new MyProfileService().myProfile.id;

      if (myId === blockedUserId) {
        const chatId: number = ChatId.from(userInitiatorId).id;
        const chat = getChatByIdDraftSelector(chatId, draft);
        if (chat) {
          chat.isBlockedByInterlocutor = true;
        }
      } else {
        const chatId: number = ChatId.from(blockedUserId).id;
        const chat = getChatByIdDraftSelector(chatId, draft);
        if (chat) {
          chat.isBlockedByUser = true;
        }
      }
      return draft;
    },
  )
  .addCase(
    UserRemovedFromBlackListEventHandler.action,
    (
        draft: IChatsState,
        { payload }: ReturnType<typeof UserRemovedFromBlackListEventHandler.action>,
      ) => {
        const { userInitiatorId, unblockedUserId } = payload;
        const myId = new MyProfileService().myProfile.id;

        if (myId === unblockedUserId) {
          const chatId = ChatId.from(userInitiatorId).id;
          const chat = getChatByIdDraftSelector(chatId, draft);
          if (chat) {
            chat.isBlockedByInterlocutor = false;
          }
        } else {
          const chatId = ChatId.from(unblockedUserId).id;
          const chat = getChatByIdDraftSelector(chatId, draft);
          if (chat) {
            chat.isBlockedByUser = false;
          }
        }
        return draft;
      },
  )

  .addCase(
    UserContactsRemovedEventHandler.action,
    (
        draft: IChatsState,
        { payload }: ReturnType<typeof UserContactsRemovedEventHandler.action>,
      ) => {
        const { userIds } = payload;

        userIds.forEach((userId) => {
          const chatId = ChatId.from(userId).id;
          const chat = getChatByIdDraftSelector(chatId, draft);

          if (chat) {
            chat.isInContacts = false;
          }
        });

        return draft;
      },
  )
  .addCase(
    UserContactAddedSuccessEventHandler.action,
    (
        draft: IChatsState,
        { payload }: ReturnType<typeof UserContactAddedSuccessEventHandler.action>,
      ) => {
        const { userId } = payload;

        const chatId = ChatId.from(userId).id;
        const chat = getChatByIdDraftSelector(chatId, draft);

        if (chat) {
          chat.isInContacts = true;
        }

        return draft;
      }
  )
  .addCase(UserMessageTypingEventHandler.action, UserMessageTypingEventHandler.reducer)
  .addCase(MemberLeftGroupChatEventHandler.action, MemberLeftGroupChatEventHandler.reducer)
  .addCase(
    MemberRemovedFromGroupChatEventHandler.action,
    MemberRemovedFromGroupChatEventHandler.reducer,
  )
  .addCase(GroupChatEditedEventHandler.action, GroupChatEditedEventHandler.reducer)
  .addCase(GroupChatCreatedEventHandler.action, GroupChatCreatedEventHandler.reducer)
  .addCase(
    ChatMutedStatusChangedEventHandler.action,
    ChatMutedStatusChangedEventHandler.reducer,
  )
  .addCase(MessageEditedEventHandler.action, MessageEditedEventHandler.reducer)
  .addCase(MessageReadEventHandler.action, MessageReadEventHandler.reducer)
  .addCase(ChatClearedEventHandler.action, ChatClearedEventHandler.reducer)
  .addCase(
    MessagesDeletedIntegrationEventHandlerSuccess.action,
    MessagesDeletedIntegrationEventHandlerSuccess.reducer
  ));

export default reducer;
