import { TFunction } from 'i18next';
import { RootState } from 'typesafe-actions';
import { IMessage } from './models/message';
import { IAttachmentToSend } from './models/attachment-to-send';
import { IBaseAttachment } from './models/attachments/base-attachment';
import { IChat } from './models/chat';
import { IChatsState } from './chats-state';
import { InterlocutorType } from './models';

// RootState selectors
export const getSelectedChatSelector = (state: RootState): IChat | undefined =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId);

export const getSelectedChatLastMessageIdSelector = (state: RootState): number | undefined =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.lastMessage
    ?.id;

export const getChatLastMessageIdSelector = (chatId: number) => (
  state: RootState,
): number | undefined =>
  state.chats.chats.chats.find((x: IChat) => x?.id === chatId)?.lastMessage?.id;

export const getChatMessagesLengthSelector = (chatId: number) => (
  state: RootState,
): number | undefined => state.chats?.messages[chatId]?.messages.length;

export const getSelectedChatMessagesSelector = (state: RootState): IMessage[] | undefined =>
  state.chats?.messages[state?.chats?.selectedChatId || -1]?.messages;

export const getSelectedChatMessagesSearchStringSelector = (state: RootState): string | undefined =>
  state.chats?.messages[state?.chats?.selectedChatId || -1]?.searchString;

export const getSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.groupChat;

export const getSelectedInterlocutorSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.interlocutor;

export const getSelectedInterlocutorIdSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.interlocutor
    ?.id;

export const getSelectedGroupChatNameSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.groupChat
    ?.name;

export const getSelectedGroupChatIdSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.groupChat?.id;

export const getSelectedChatUnreadMessagesCountSelector = (state: RootState): number | undefined =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)
    ?.unreadMessagesCount;

export const getSelectedChatAttachmentsToSendSelector = (
  state: RootState,
): IAttachmentToSend<IBaseAttachment>[] | undefined =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)
    ?.attachmentsToSend;

export const getIsFirstChatsLoadSelector = (state: RootState): boolean =>
  (typeof state.chats.chats.loading === 'undefined' || state.chats.chats.loading === true) &&
  state.chats.chats.chats.length === 0;

export const getChatsPageSelector = (state: RootState) => state.chats.chats.page;

export const getChatsSearchPageSelector = (state: RootState) => state.chats.searchChats.page;

// Attachments list selector

export const getSelectedChatRecordingsSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.recordings;

export const getSelectedChatAudiosSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.audios;

export const getSelectedChatFilesSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.files;

export const getSelectedChatPhotosSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.photos;

export const getSelectedChatVideosSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.videos;

// Attachments count selector

export const getPictureAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)
    ?.pictureAttachmentsCount || 0;

export const getVideoAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)
    ?.videoAttachmentsCount || 0;

export const getFilesAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)
    ?.rawAttachmentsCount || 0;

export const getVoiceAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)
    ?.voiceAttachmentsCount || 0;

export const getAudioAttachmentsCountSelector = (state: RootState): number =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)
    ?.audioAttachmentsCount || 0;
// -----------

export const getSelectedChatInterlocutorNameSelector = (state: RootState) => {
  const selectedChat = state.chats.chats.chats.find(
    (x: IChat) => x?.id === state?.chats?.selectedChatId,
  );

  return selectedChat?.interlocutor
    ? `${selectedChat?.interlocutor?.firstName} ${selectedChat?.interlocutor?.lastName}`
    : selectedChat?.groupChat?.name;
};

export const getSelectedChatIdSelector = (state: RootState): number | null =>
  state.chats.selectedChatId;

export const getChatByIdSelector = (chatId: number) => (state: RootState) =>
  state.chats.chats.chats.find(({ id }) => id === chatId);

export const getSearchChatsListSelector = (state: RootState) => state.chats.searchChats;
export const getChatsListSelector = (state: RootState) => state.chats.chats;

export const getMembersForSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.members
    ?.members;

export const getMembersListForSelectedGroupChatSelector = (state: RootState) =>
  state.chats.chats.chats.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.members;

export const getTypingStringSelector = (t: TFunction, chatId: number | null) => (
  state: RootState,
) => {
  const typingUsers = state.chats.chats.chats.find(({ id }) => id === chatId)?.typingInterlocutors;

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
  state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.messageToEdit;

export const getMessageToReplySelector = (state: RootState) =>
  state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.messageToReply;

export const getMessagesLoadingSelector = (state: RootState) =>
  state.chats.messages[state.chats.selectedChatId || -1]?.loading;

export const getHasMoreMessagesMessagesSelector = (state: RootState) =>
  state.chats.messages[state.chats.selectedChatId || -1]?.hasMore;

export const getMessagesByChatIdSelector = (state: RootState) =>
  state.chats.messages[state.chats.selectedChatId || -1]?.messages;

export const getChatMessageByIdSelector = (messageId: number, chatId: number) => (
  state: RootState,
) => state.chats.messages[chatId]?.messages.find(({ id }) => id === messageId);

export const getChatHasMessageWithIdSelector = (messageId: number, chatId: number) => (
  state: RootState,
) => state.chats.messages[chatId]?.messages.findIndex(({ id }) => id === messageId) > -1;

// IChatsState selectors
export const getChatExistsDraftSelector = (chatId: number, draft: IChatsState): boolean =>
  chatId !== null && Boolean(draft.chats.chats.find(({ id }) => id === chatId));

export const getChatByIdDraftSelector = (chatId: number, draft: IChatsState) =>
  draft.chats.chats.find(({ id }) => id === chatId);

export const getMessageDraftSelector = (chatId: number, messageId: number, draft: IChatsState) =>
  draft.messages[chatId]?.messages.find(({ id }) => id === messageId);

export const getChatIndexDraftSelector = (chatId: number, draft: IChatsState) =>
  draft.chats.chats.findIndex(({ id }) => id === chatId);

export const isCurrentChatBlackListedSelector = (state: RootState) =>
  state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.isBlockedByUser;

export const isCurrentChatContactSelector = (state: RootState) =>
  state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.isInContacts;

export const isCurrentChatDismissedAddToContactsSelector = (state: RootState) => {
  const currentChat = state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId);

  if (currentChat?.interlocutorType === InterlocutorType.GroupChat) {
    return true;
  }

  const isDismissedAddToContacts = currentChat?.isDismissedAddToContacts;
  return isDismissedAddToContacts === undefined ? true : isDismissedAddToContacts;
};

export const amIBlackListedByInterlocutorSelector = (state: RootState) =>
  state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId)
    ?.isBlockedByInterlocutor;

export const isCurrentChatUserDeactivatedSelector = (state: RootState) =>
  state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.interlocutor
    ?.deactivated;

export const isCurrentChatUserDeletedSelector = (state: RootState) =>
  state.chats.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.interlocutor
    ?.deleted;
