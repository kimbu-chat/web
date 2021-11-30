import produce from 'immer';
import { SystemMessageType } from 'kimbu-models';
import { createReducer } from 'typesafe-actions';

import { MyProfileService } from '@services/my-profile-service';
import { GetPossibleMembersSuccess } from '@store/chats/features/get-possible-members/get-possible-members-success';
import { ResetSearchPossibleMembers } from '@store/chats/features/get-possible-members/reset-search-possible-members';
import { MessageState, INormalizedChat } from '@store/chats/models';
import { DismissToAddContactSuccess } from '@store/friends/features/dismiss-to-add-contact/dismiss-to-add-contact-success';
import { UserContactAddedSuccessEventHandler } from '@store/friends/socket-events/user-contact-added/user-contact-added-success-event-handler';
import { UserContactsRemovedEventHandler } from '@store/friends/socket-events/user-contacts-removed/user-contacts-removed-event-handler';
import { GetMyProfileSuccess } from '@store/my-profile/features/get-my-profile/get-my-profile-success';
import { UserAddedToBlackListEventHandler } from '@store/settings/socket-events/user-added-to-black-list/user-added-to-black-list-event-handler';
import { UserRemovedFromBlackListEventHandler } from '@store/settings/socket-events/user-removed-from-black-list/user-removed-from-black-list-event-handler';
import { APPEARANCE_CHAT_ID } from '@utils/constants';

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
import { MarkMessagesAsReadSuccess } from './features/mark-messages-as-read/mark-messages-as-read-success';
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

const reducer = createReducer<IChatsState>(initialState)
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
  .handleAction(GetPossibleMembersSuccess.action, GetPossibleMembersSuccess.reducer)
  .handleAction(ResetSearchPossibleMembers.action, ResetSearchPossibleMembers.reducer)
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
  .handleAction(RemoveUserFromGroupChatSuccess.action, RemoveUserFromGroupChatSuccess.reducer)
  .handleAction(RemoveChatSuccess.action, RemoveChatSuccess.reducer)
  .handleAction(MessageCreatedEventHandlerSuccess.action, MessageCreatedEventHandlerSuccess.reducer)
  .handleAction(DialogRemovedEventHandler.action, DialogRemovedEventHandler.reducer)
  .handleAction(ResetSearchChats.action, ResetSearchChats.reducer)
  .handleAction(RemoveChat.action, RemoveChat.reducer)
  .handleAction(UploadVoiceAttachment.action, UploadVoiceAttachment.reducer)
  .handleAction(UploadVoiceAttachmentSuccess.action, UploadVoiceAttachmentSuccess.reducer)
  .handleAction(
    BlockUserSuccess.action,
    produce((draft, { payload }: ReturnType<typeof BlockUserSuccess.action>) => {
      const userId = payload;
      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      chat.isBlockedByUser = true;

      return draft;
    }),
  )
  .handleAction(
    UnblockUserSuccess.action,
    produce((draft: IChatsState, { payload }: ReturnType<typeof UnblockUserSuccess.action>) => {
      const userId = payload;
      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      chat.isBlockedByUser = false;

      return draft;
    }),
  )
  .handleAction(
    UserAddedToBlackListEventHandler.action,
    produce((draft, { payload }: ReturnType<typeof UserAddedToBlackListEventHandler.action>) => {
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
    }),
  )
  .handleAction(
    UserRemovedFromBlackListEventHandler.action,
    produce(
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
    ),
  )
  .handleAction(
    DeleteFriendSuccess.action,
    produce((draft: IChatsState, { payload }: ReturnType<typeof DeleteFriendSuccess.action>) => {
      const userId = payload;

      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (chat) {
        chat.isInContacts = false;
      }

      return draft;
    }),
  )
  .handleAction(
    UserContactsRemovedEventHandler.action,
    produce(
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
    ),
  )
  .handleAction(
    UserContactAddedSuccessEventHandler.action,
    produce(
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
      },
    ),
  )
  .handleAction(
    AddFriendSuccess.action,
    produce((draft: IChatsState, { payload }: ReturnType<typeof AddFriendSuccess.action>) => {
      const userId = payload;
      const chatId = ChatId.from(userId).id;
      const chat = getChatByIdDraftSelector(chatId, draft);

      if (!chat) {
        return draft;
      }

      chat.isInContacts = true;

      return draft;
    }),
  )
  .handleAction(
    DismissToAddContactSuccess.action,
    produce(
      (draft: IChatsState, { payload }: ReturnType<typeof DismissToAddContactSuccess.action>) => {
        const chatId: number = ChatId.from(payload).id;
        const chat = getChatByIdDraftSelector(chatId, draft);

        if (!chat) {
          return draft;
        }

        chat.isDismissedAddToContacts = true;

        return draft;
      },
    ),
  )
  .handleAction(
    GetMyProfileSuccess.action,
    produce((draft: IChatsState, { payload }: ReturnType<typeof GetMyProfileSuccess.action>) => {
      const currentUserId = payload.user.id;
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
    }),
  )

  // socket-events
  .handleAction(UserMessageTypingEventHandler.action, UserMessageTypingEventHandler.reducer)
  .handleAction(MemberLeftGroupChatEventHandler.action, MemberLeftGroupChatEventHandler.reducer)
  .handleAction(
    MemberRemovedFromGroupChatEventHandler.action,
    MemberRemovedFromGroupChatEventHandler.reducer,
  )
  .handleAction(GroupChatEditedEventHandler.action, GroupChatEditedEventHandler.reducer)
  .handleAction(GroupChatCreatedEventHandler.action, GroupChatCreatedEventHandler.reducer)
  .handleAction(
    ChatMutedStatusChangedEventHandler.action,
    ChatMutedStatusChangedEventHandler.reducer,
  )
  .handleAction(MessageEditedEventHandler.action, MessageEditedEventHandler.reducer)
  .handleAction(MessageReadEventHandler.action, MessageReadEventHandler.reducer)
  .handleAction(ChatClearedEventHandler.action, ChatClearedEventHandler.reducer)
  .handleAction(
    MessagesDeletedIntegrationEventHandlerSuccess.action,
    MessagesDeletedIntegrationEventHandlerSuccess.reducer,
  );

export default reducer;
