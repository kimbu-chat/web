import { TFunction } from 'i18next';
import { RootState } from 'typesafe-actions';
import { IAttachmentToSend } from './models/attachment-to-send';
import { IBaseAttachment } from './models/attachments/base-attachment';
import { IChat } from './models/chat';
import { IChatsState } from './chats-state';
import { InterlocutorType } from './models';

// RootState selectors
export const getSelectedChatSelector = (state: RootState): IChat | undefined =>
  state.chats.chats[state?.chats?.selectedChatId || -1];

export const getSelectedChatLastMessageIdSelector = (state: RootState): number | undefined =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.lastMessage?.id;

export const getChatLastMessageIdSelector = (chatId: number) => (
  state: RootState,
): number | undefined => state.chats.chats[chatId]?.lastMessage?.id;

export const getChatMessagesLengthSelector = (chatId: number) => (
  state: RootState,
): number | undefined => state.chats?.messages[chatId]?.messageIds.length;

export const getSelectedChatMessagesSelector = (state: RootState): number[] | undefined =>
  state.chats?.messages[state?.chats?.selectedChatId || -1]?.messageIds;

export const getSelectedChatMessagesSearchStringSelector = (state: RootState): string | undefined =>
  state.chats?.messages[state?.chats?.selectedChatId || -1]?.searchString;

export const getSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.groupChat;

export const getSelectedInterlocutorSelector = (state: RootState) =>
  state.users.users[state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutor || -1];

export const getSelectedInterlocutorIdSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutor;

export const getSelectedGroupChatNameSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.groupChat?.name;

export const getSelectedGroupChatIdSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.groupChat?.id;

export const getSelectedChatUnreadMessagesCountSelector = (state: RootState): number | undefined =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.unreadMessagesCount;

export const getSelectedChatAttachmentsToSendSelector = (
  state: RootState,
): IAttachmentToSend<IBaseAttachment>[] | undefined =>
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
  state.chats.chats[state?.chats?.selectedChatId || -1]?.recordings;

export const getSelectedChatAudiosSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.audios;

export const getSelectedChatFilesSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.files;

export const getSelectedChatPhotosSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.photos;

export const getSelectedChatVideosSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.videos;

// Attachments count selector

export const getPictureAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.pictureAttachmentsCount || 0;

export const getVideoAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.videoAttachmentsCount || 0;

export const getFilesAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.rawAttachmentsCount || 0;

export const getVoiceAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.voiceAttachmentsCount || 0;

export const getAudioAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.audioAttachmentsCount || 0;
// -----------

export const getSelectedChatIdSelector = (state: RootState): number | null =>
  state.chats.selectedChatId;

export const getChatByIdSelector = (chatId: number) => (state: RootState) =>
  state.chats.chats[chatId];

export const getSearchChatsListSelector = (state: RootState) => state.chats.searchChatList;
export const getChatsListSelector = (state: RootState) => state.chats.chatList;

export const getMembersForSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.members?.members;

export const getMembersListForSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats[state?.chats?.selectedChatId || -1]?.members;

export const getTypingStringSelector = (t: TFunction, chatId: number | null) => (
  state: RootState,
) => {
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

export const getIsSelectMessagesStateSelector = (state: RootState) =>
  state.chats.selectedMessageIds.length > 0;

export const getSelectedMessagesIdSelector = (state: RootState) => state.chats.selectedMessageIds;

export const getIsInfoOpenedSelector = (state: RootState) => state.chats.isInfoOpened;

export const getMessageToEditSelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messageToEdit;

export const getMessageToReplySelector = (state: RootState) =>
  state.chats.chats[state.chats.selectedChatId || -1]?.messageToReply;

export const getMessagesLoadingSelector = (state: RootState) =>
  state.chats.messages[state.chats.selectedChatId || -1]?.loading;

export const getHasMoreMessagesMessagesSelector = (state: RootState) =>
  state.chats.messages[state.chats.selectedChatId || -1]?.hasMore;

export const getMessagesIdsByChatIdSelector = (state: RootState) =>
  state.chats.messages[state.chats.selectedChatId || -1]?.messageIds;

export const getChatMessageByIdSelector = (messageId: number, chatId: number) => (
  state: RootState,
) => state.chats.messages[chatId]?.messages[messageId];

export const getMessageSelector = (chatId: number, messageId: number) => (state: RootState) =>
  state.chats.messages[chatId]?.messages[messageId];

export const getChatHasMessageWithIdSelector = (messageId: number, chatId: number) => (
  state: RootState,
) => state.chats.messages[chatId]?.messages[messageId] !== undefined;

// IChatsState selectors
export const getChatExistsDraftSelector = (chatId: number, draft: IChatsState): boolean =>
  chatId !== null && Boolean(draft.chats[chatId]);

export const getChatByIdDraftSelector = (chatId: number, draft: IChatsState) => draft.chats[chatId];

export const getMessageDraftSelector = (chatId: number, messageId: number, draft: IChatsState) =>
  draft.messages[chatId]?.messages[messageId];

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
  state.users.users[state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutor || -1]
    ?.deactivated;

export const isCurrentChatUserDeletedSelector = (state: RootState) =>
  state.users.users[state.chats.chats[state?.chats?.selectedChatId || -1]?.interlocutor || -1]
    ?.deleted;
