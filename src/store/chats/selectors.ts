import { AttachmentType, IAttachmentBase } from 'kimbu-models';
import unionBy from 'lodash/unionBy';

import { INormalizedChat, INormalizedMessage, InterlocutorType } from './models';

import type { IChatsState } from './chats-state';
import type { IAttachmentToSend } from './models/attachment-to-send';
import type { ById } from './models/by-id';
import type { TFunction } from 'i18next';
import type { IAudioAttachment } from 'kimbu-models';
import type { RootState } from 'typesafe-actions';

// RootState selectors
export const getSelectedChatSelector = (state: RootState): INormalizedChat | undefined =>
  state.chats.chats[state?.chats?.selectedChatId || -1];

export const getSelectedChatLastMessageIdSelector = (state: RootState): number | undefined =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.lastMessage?.id;

export const getChatLastMessageIdSelector =
  (chatId: number) =>
  (state: RootState): number | undefined =>
    state.chats.chats[chatId]?.lastMessage?.id;

export const getChatMessagesLengthSelector =
  (chatId: number) =>
  (state: RootState): number | undefined =>
    state.chats?.chats[chatId]?.messages.messageIds.length;

export const getSelectedChatMessageIdsSelector = (state: RootState): number[] | undefined =>
  state.chats?.chats[state?.chats?.selectedChatId || -1]?.messages.messageIds;

export const getSelectedChatMessagesSearchStringSelector = (state: RootState): string | undefined =>
  state.chats?.chats[state?.chats?.selectedChatId || -1]?.messages.searchString;

export const getSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.groupChat;

export const getSelectedInterlocutorSelector = (state: RootState) =>
  state.users.users[state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutorId || -1];

export const getSelectedInterlocutorIdSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutorId;

export const getSelectedGroupChatNameSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.groupChat?.name;

export const getSelectedGroupChatCreatorIdSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.groupChat?.userCreatorId;

export const getSelectedGroupChatIdSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.groupChat?.id;

export const getSelectedChatUnreadMessagesCountSelector = (state: RootState): number | undefined =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.unreadMessagesCount;

export const getSelectedChatAttachmentsToSendSelector = (
  state: RootState,
): IAttachmentToSend<IAttachmentBase>[] | undefined =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.attachmentsToSend;

export const getIsFirstChatsLoadSelector = (state: RootState): boolean =>
  (state.chats.chatList.loading === undefined || state.chats.chatList.loading === true) &&
  state.chats.chatList.chatIds.length === 0;

export const getChatSelector = (chatId?: number) => (state: RootState) =>
  state.chats.chats[chatId || -1];

export const getChatsPageSelector = (state: RootState) => state.chats.chatList.page;

export const getChatsSearchPageSelector = (state: RootState) => state.chats.searchChatList.page;

// Attachments list selector

export const getSelectedChatRecordingsSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.recordings;

export const getSelectedChatRecordingsLengthSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.recordings
    .recordings.length || 0;

export const getSelectedChatAudiosSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.audios;

export const getSelectedChatAudiosLengthSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.audios.audios
    .length || 0;

export const getSelectedChatFilesSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.files;

export const getSelectedChatFilesLengthSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.files.files
    .length || 0;

export const getSelectedChatPhotosSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.photos;

export const getSelectedChatPhotosLengthSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.photos.photos
    .length || 0;

export const getSelectedChatVideosSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.videos;

export const getSelectedChatVideosLengthSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]?.videos.videos
    .length || 0;

// Attachments count selector

export const getPictureAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]
    ?.pictureAttachmentsCount || 0;

export const getVideoAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]
    ?.videoAttachmentsCount || 0;

export const getFilesAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]
    ?.rawAttachmentsCount || 0;

export const getVoiceAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]
    ?.voiceAttachmentsCount || 0;

export const getAudioAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1]
    ?.audioAttachmentsCount || 0;
// -----------

export const getSelectedChatIdSelector = (state: RootState): number | undefined =>
  state.chats.selectedChatId;

export const getSelectedChatAudioAttachmentsSelector =
  (chatId: number) =>
  (state: RootState): IAudioAttachment[] => {
    const audioAttachments: IAudioAttachment[] = [];

    Object.values(state.chats.chats[chatId]?.messages.messages).forEach((message) => {
      message?.attachments?.forEach((attachment) => {
        if (attachment.type === AttachmentType.Audio) {
          if (!audioAttachments.find(({ id }) => id === attachment.id)) {
            audioAttachments.push(attachment as IAudioAttachment);
          }
        }
      });

      message?.linkedMessage?.attachments?.forEach((attachment) => {
        if (attachment.type === AttachmentType.Audio) {
          if (!audioAttachments.find(({ id }) => id === attachment.id)) {
            audioAttachments.push(attachment as IAudioAttachment);
          }
        }
      });
    });

    return unionBy(audioAttachments, state.chats.chats[chatId]?.audios.audios, 'id');
  };

export const getChatByIdSelector = (chatId: number) => (state: RootState) =>
  state.chats.chats[chatId];

export const getSearchChatsListSelector = (state: RootState) => state.chats.searchChatList;
export const getChatsListSelector = (state: RootState) => state.chats.chatList;

export const getMembersListForSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.members;

export const getMembersCountForSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.members.memberIds.length || 0;

export const getTypingStringSelector =
  (t: TFunction, chatId: number | null) => (state: RootState) => {
    const typingUsers = state.chats.chats[chatId || -1]?.typingInterlocutors;

    if (typingUsers) {
      if (typingUsers.length === 1) {
        return t('chat.typing', { firstInterlocutorName: typingUsers[0].split(' ')[0] });
      }
      if (typingUsers.length === 2) {
        return t('chat.typing_two', {
          firstInterlocutorName: typingUsers[0].split(' ')[0],
          secondInterlocutorName: typingUsers[1].split(' ')[0],
        });
      }
      if (typingUsers.length > 2) {
        return t('chat.typing_many', {
          firstInterlocutorName: typingUsers[0].split(' ')[0],
          secondInterlocutorName: typingUsers[1].split(' ')[0],
          remainingCount: typingUsers.length - 2,
        });
      }
    }

    return undefined;
  };

export const getSelectedMessageIds = (state: RootState) => state.chats.selectedMessageIds;

export const getIsSelectMessagesStateSelector = (state: RootState) =>
  state.chats.selectedMessageIds.length > 0;

export const getSelectedMessagesIdSelector = (state: RootState) => state.chats.selectedMessageIds;

export const getIsInfoOpenedSelector = (state: RootState) => state.chats.chatInfo.isInfoOpened;

export const getInfoChatSelector = (state: RootState) =>
  state.chats.chats[state.chats.chatInfo.chatId || state.chats.selectedChatId || -1];

export const getInfoChatIdSelector = (state: RootState) =>
  state.chats.chatInfo.chatId || state.chats.selectedChatId;

export const getMessageToEditSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messageToEdit;

export const getMessageToReplySelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messageToReply;

export const getMessagesLoadingSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messages.loading;

export const getHasMoreMessagesMessagesSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messages.hasMore;

export const getMessagesIdsByChatIdSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messages.messageIds;

export const getSelectedChatMessagesSelector = (state: RootState): ById<INormalizedMessage> =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messages.messages;

export const getMessageSelector = (chatId: number, messageId: number) => (state: RootState) =>
  state.chats.chats[chatId]?.messages.messages[messageId];

export const getChatHasMessageWithIdSelector =
  (messageId: number, chatId: number) => (state: RootState) =>
    state.chats.chats[chatId]?.messages.messages[messageId] !== undefined;

// IChatsState selectors
export const getChatExistsDraftSelector = (chatId: number, draft: IChatsState): boolean =>
  chatId !== null && Boolean(draft.chats[chatId]);

export const getChatByIdDraftSelector = (chatId: number, draft: IChatsState) => draft.chats[chatId];

export const getMessageDraftSelector = (chatId: number, messageId: number, draft: IChatsState) =>
  draft.chats[chatId]?.messages.messages[messageId];

export const isCurrentChatBlackListedSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.isBlockedByUser;

export const isCurrentChatContactSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.isInContacts;

export const isCurrentChatDismissedAddToContactsSelector = (state: RootState) => {
  const currentChat = state.chats.chats[state.chats.selectedChatId || -1];

  if (currentChat?.interlocutorType === InterlocutorType.GroupChat) {
    return true;
  }

  const isDismissedAddToContacts = currentChat?.isDismissedAddToContacts;
  return isDismissedAddToContacts === undefined ? true : isDismissedAddToContacts;
};

export const amIBlackListedByInterlocutorSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.isBlockedByInterlocutor;

export const isCurrentChatUserDeactivatedSelector = (state: RootState) =>
  state.users.users[state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutorId || -1]
    ?.deactivated;

export const isCurrentChatUserDeletedSelector = (state: RootState) =>
  state.users.users[state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutorId || -1]
    ?.deleted;
