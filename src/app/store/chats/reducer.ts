import produce from 'immer';
import { createReducer } from 'typesafe-actions';
import { unionBy } from 'lodash';
import { Chat, BaseAttachment, AttachmentToSend, AudioAttachment, PictureAttachment, RawAttachment, VideoAttachment, VoiceAttachment } from './models';
import { ChatId } from './chat-id';
import { ChatActions } from './actions';
import { MessageActions } from '../messages/actions';
import { FriendActions } from '../friends/actions';
import { FileType, MessageState } from '../messages/models';

export interface ChatsState {
  loading: boolean;
  hasMore: boolean;
  searchString: string;
  chats: Chat[];
  selectedChatId?: number;
}

const initialState: ChatsState = {
  loading: false,
  hasMore: true,
  searchString: '',
  chats: [],
};

const checkChatExists = (chatId: number, state: ChatsState): boolean => Boolean(state.chats.find(({ id }) => id === chatId));

const getChatArrayIndex = (chatId: number, state: ChatsState): number => state.chats.findIndex(({ id }) => id === chatId);

const chats = createReducer<ChatsState>(initialState)
  .handleAction(
    ChatActions.interlocutorStoppedTyping,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.interlocutorStoppedTyping>) => {
      const { chatId, interlocutorName } = payload;

      const isChatExists: boolean = checkChatExists(chatId, draft);

      if (!isChatExists) {
        return draft;
      }

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      draft.chats[chatIndex].timeoutId = undefined;
      draft.chats[chatIndex].typingInterlocutors = draft.chats[chatIndex].typingInterlocutors?.filter((user) => user.fullName !== interlocutorName);

      return draft;
    }),
  )
  .handleAction(
    ChatActions.interlocutorMessageTyping,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.interlocutorMessageTyping>) => {
      const { chatId, interlocutorName, timeoutId } = payload;

      const isChatExists: boolean = checkChatExists(chatId, draft);

      if (!isChatExists) {
        return draft;
      }

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      clearTimeout(draft.chats[chatIndex].timeoutId as NodeJS.Timeout);

      const typingUser = {
        timeoutId,
        fullName: interlocutorName,
      };

      draft.chats[chatIndex].draftMessage = payload.text;
      draft.chats[chatIndex].timeoutId = timeoutId;

      if (!draft.chats[chatIndex].typingInterlocutors?.find(({ fullName }) => fullName === interlocutorName)) {
        draft.chats[chatIndex].typingInterlocutors = [...(draft.chats[chatIndex].typingInterlocutors || []), typingUser];
      }

      return draft;
    }),
  )
  .handleAction(
    ChatActions.createGroupChatSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.createGroupChatSuccess>) => {
      const newChat = payload;

      const isChatExists: boolean = checkChatExists(newChat.id, draft);

      if (!isChatExists) {
        draft.chats.unshift(newChat);
        return draft;
      }

      return draft;
    }),
  )
  .handleAction(
    ChatActions.addUsersToGroupChatSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.addUsersToGroupChatSuccess>) => {
      const { chat } = payload;

      const chatIndex: number = getChatArrayIndex(chat.id, draft);

      draft.chats[chatIndex].groupChat!.membersCount = draft.chats[chatIndex].groupChat!.membersCount + 1;

      return draft;
    }),
  )
  .handleAction(
    ChatActions.muteChatSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.muteChatSuccess>) => {
      const { id } = payload;

      const chatIndex: number = getChatArrayIndex(id, draft);

      draft.chats[chatIndex].isMuted = !draft.chats[chatIndex].isMuted;

      return draft;
    }),
  )
  .handleAction(
    ChatActions.changeSelectedChat,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.changeSelectedChat>) => {
      draft.chats.sort(
        ({ lastMessage: lastMessageA }, { lastMessage: lastMessageB }) =>
          new Date(lastMessageB?.creationDateTime!).getTime() - new Date(lastMessageA?.creationDateTime!).getTime(),
      );

      if (payload !== -1) {
        draft.selectedChatId = payload;
      }

      return draft;
    }),
  )
  .handleAction(
    ChatActions.getChats,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getChats>) => ({
      ...draft,
      loading: true,
      searchString: payload.name || '',
    })),
  )
  .handleAction(
    ChatActions.getChatsSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getChatsSuccess>) => {
      const { chats, hasMore, initializedBySearch } = payload;

      draft.loading = false;
      draft.hasMore = hasMore;

      if (initializedBySearch) {
        draft.chats = chats;
      } else {
        draft.chats = unionBy(draft.chats, chats, 'id');
      }

      return draft;
    }),
  )
  .handleAction(
    ChatActions.getChatsFailure,
    produce((draft: ChatsState) => ({
      ...draft,
      loading: false,
    })),
  )
  .handleAction(
    [ChatActions.leaveGroupChatSuccess, ChatActions.changeChatVisibilityStateSuccess],
    produce(
      (
        draft: ChatsState,
        { payload }: ReturnType<typeof ChatActions.leaveGroupChatSuccess> | ReturnType<typeof ChatActions.changeChatVisibilityStateSuccess>,
      ) => {
        const chatIndex: number = getChatArrayIndex(payload.id, draft);
        draft.chats.splice(chatIndex, 1);
        draft.selectedChatId = -1;
        return draft;
      },
    ),
  )
  .handleAction(
    ChatActions.markMessagesAsRead,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.markMessagesAsRead>) => {
      const { chatId } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);
      draft.chats[chatIndex].ownUnreadMessagesCount = 0;
      return draft;
    }),
  )
  .handleAction(
    MessageActions.createMessage,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createMessage>) => {
      const { message, chatId, currentUserId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      const isCurrentUserMessageCreator: boolean = currentUserId === message.userCreator?.id;

      // if user already has chats with interlocutor - update chat
      if (chatIndex >= 0) {
        const isInterlocutorCurrentSelectedChat: boolean = draft.selectedChatId === chatId;
        const previousOwnUnreadMessagesCount = draft.chats[chatIndex].ownUnreadMessagesCount || 0;
        const ownUnreadMessagesCount =
          isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator ? previousOwnUnreadMessagesCount : previousOwnUnreadMessagesCount + 1;

        draft.chats[chatIndex].attachmentsToSend = [];
        draft.chats[chatIndex].lastMessage = { ...message };
        draft.chats[chatIndex].ownUnreadMessagesCount = ownUnreadMessagesCount;
        draft.chats[chatIndex].draftMessage = '';

        const chatWithNewMessage = draft.chats[chatIndex];

        draft.chats.splice(chatIndex, 1);

        draft.chats.unshift(chatWithNewMessage);
      }
      return draft;
    }),
  )
  .handleAction(
    FriendActions.userStatusChangedEvent,
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
    ChatActions.changeInterlocutorLastReadMessageId,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.changeInterlocutorLastReadMessageId>) => {
      const { lastReadMessageId, userReaderId, objectType, groupChatId } = payload;

      const chatId = new ChatId().From(objectType === 'User' ? userReaderId : undefined, objectType === 'GroupChat' ? groupChatId : undefined).entireId;

      const chatIndex = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].interlocutorLastReadMessageId = lastReadMessageId;

        if (draft.chats[chatIndex].lastMessage?.id! <= lastReadMessageId) {
          draft.chats[chatIndex].lastMessage!.state = MessageState.READ;
        }
      }

      return draft;
    }),
  )
  .handleAction(
    MessageActions.createMessageSuccess,
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
    MessageActions.createChat,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.createChat>) => {
      const { id } = payload;

      const chatId: number = new ChatId().From(id).entireId;

      const isChatExists = checkChatExists(chatId, draft);

      draft.selectedChatId = chatId;

      if (isChatExists) {
        return draft;
      }
      // user does not have dialog with interlocutor - create dialog
      const newChat: Chat = {
        id: chatId,
        draftMessage: '',
        interlocutorType: 1,
        ownUnreadMessagesCount: 0,
        interlocutorLastReadMessageId: 0,
        interlocutor: payload,
        typingInterlocutors: [],
        photos: {
          hasMore: true,
          photos: [],
        },
        videos: {
          hasMore: true,
          videos: [],
        },
        files: {
          hasMore: true,
          files: [],
        },
        recordings: {
          hasMore: true,
          recordings: [],
        },
        audios: {
          hasMore: true,
          audios: [],
        },
      };

      draft.chats.unshift(newChat);

      return draft;
    }),
  )
  .handleAction(
    ChatActions.getPhotoAttachmentsSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getPhotoAttachmentsSuccess>) => {
      const { photos, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].photos.photos.push(...photos);
        draft.chats[chatIndex].photos.hasMore = hasMore;
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.getVideoAttachmentsSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getVideoAttachmentsSuccess>) => {
      const { videos, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].videos.videos.push(...videos);
        draft.chats[chatIndex].videos.hasMore = hasMore;
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.getRawAttachmentsSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getRawAttachmentsSuccess>) => {
      const { files, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].files.files.push(...files);
        draft.chats[chatIndex].files.hasMore = hasMore;
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.getVoiceAttachmentsSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getVoiceAttachmentsSuccess>) => {
      const { recordings, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].recordings.recordings.push(...recordings);
        draft.chats[chatIndex].recordings.hasMore = hasMore;
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.getAudioAttachmentsSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getAudioAttachmentsSuccess>) => {
      const { audios, chatId, hasMore } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].audios.audios.push(...audios);
        draft.chats[chatIndex].audios.hasMore = hasMore;
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.uploadAttachmentRequestAction,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.uploadAttachmentRequestAction>) => {
      const { type, chatId, attachmentId, file } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          draft.chats[chatIndex].attachmentsToSend = [];
        }

        const attachmentToAdd: AttachmentToSend<BaseAttachment> = {
          attachment: {
            id: attachmentId,
            byteSize: file.size,
            creationDateTime: new Date(),
            url: '',
            type,
          },
          progress: 0,
          fileName: file.name,
          file,
        };

        draft.chats[chatIndex].attachmentsToSend?.push(attachmentToAdd);
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.uploadAttachmentProgressAction,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.uploadAttachmentProgressAction>) => {
      const { progress, chatId, attachmentId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        const currentAttachment = draft.chats[chatIndex].attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

        if (currentAttachment) {
          currentAttachment.progress = progress;
        }
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.uploadAttachmentSuccessAction,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.uploadAttachmentSuccessAction>) => {
      const { chatId, attachmentId, attachment } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        const currentAttachment = draft.chats[chatIndex].attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

        if (currentAttachment) {
          currentAttachment.progress = 100;
          currentAttachment.success = true;
          currentAttachment.attachment = { ...currentAttachment.attachment, ...attachment };
        }
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.uploadAttachmentFailureAction,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.uploadAttachmentFailureAction>) => {
      const { chatId, attachmentId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        const currentAttachment = draft.chats[chatIndex].attachmentsToSend?.find(({ attachment }) => attachment.id === attachmentId);

        if (currentAttachment) {
          currentAttachment.success = false;
          currentAttachment.failure = true;
        }
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.removeAttachmentAction,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.removeAttachmentAction>) => {
      const { chatId, attachmentId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          return draft;
        }

        draft.chats[chatIndex].attachmentsToSend = draft.chats[chatIndex].attachmentsToSend?.filter(({ attachment }) => attachment.id !== attachmentId);
      }

      return draft;
    }),
  )
  .handleAction(
    ChatActions.getChatInfoSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.getChatInfoSuccess>) => {
      const { chatId, rawAttachmentsCount, voiceAttachmentsCount, videoAttachmentsCount, audioAttachmentsCount, pictureAttachmentsCount } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].rawAttachmentsCount = rawAttachmentsCount;
        draft.chats[chatIndex].voiceAttachmentsCount = voiceAttachmentsCount;
        draft.chats[chatIndex].videoAttachmentsCount = videoAttachmentsCount;
        draft.chats[chatIndex].audioAttachmentsCount = audioAttachmentsCount;
        draft.chats[chatIndex].pictureAttachmentsCount = pictureAttachmentsCount;
      }
      return draft;
    }),
  )
  .handleAction(
    ChatActions.editGroupChatSuccess,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.editGroupChatSuccess>) => {
      const { id, name, description, avatar } = payload;

      const chatId: number = new ChatId().From(undefined, id).entireId;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].groupChat!.name = name;
        draft.chats[chatIndex].groupChat!.description = description;
        draft.chats[chatIndex].groupChat!.avatar = avatar;
      }
      return draft;
    }),
  )
  .handleAction(
    MessageActions.submitEditMessage,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.submitEditMessage>) => {
      const { chatId } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].attachmentsToSend = [];
      }

      return draft;
    }),
  )
  .handleAction(
    MessageActions.messageTyping,
    produce((draft: ChatsState, { payload }: ReturnType<typeof MessageActions.messageTyping>) => {
      const { chatId, text } = payload;
      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].draftMessage = text;
      }

      return draft;
    }),
  )
  .handleAction(
    ChatActions.unshiftChat,
    produce((draft: ChatsState, { payload }: ReturnType<typeof ChatActions.unshiftChat>) => {
      draft.chats.unshift(payload);

      return draft;
    }),
  );

export default chats;
