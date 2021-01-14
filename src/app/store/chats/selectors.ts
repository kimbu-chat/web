import { TFunction } from 'i18next';
import { RootState } from '../root-reducer';
import { IAttachmentToSend } from './models/attachment-to-send';
import { IBaseAttachment } from './models/attachments/base-attachment';
import { IChat } from './models/chat';
import { IChatsState } from './models/chats-state';

// RootState selectors
export const getSelectedChatSelector = (state: RootState): IChat | undefined => state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId);

export const getSelectedGroupChatSelector = (state: RootState) => state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.groupChat;

export const getSelectedGroupChatNameSelector = (state: RootState) =>
  state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.groupChat?.name;

export const getSelectedChatUnreadMessagesCountSelector = (state: RootState): number | undefined =>
  state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.unreadMessagesCount;

export const getSelectedChatAttachmentsToSendSelector = (state: RootState): IAttachmentToSend<IBaseAttachment>[] | undefined =>
  state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.attachmentsToSend;

export const getIsFirstChatsLoadSelector = (state: RootState): boolean => typeof state.chats.loading === 'undefined' && state.chats.chats.length === 0;

export const getChatsPageSelector = (state: RootState) => (state.chats.searchString.length > 0 ? state.chats.searchPage : state.chats.page);

// Attachments list selector

export const getSelectedChatRecordingsSelector = (state: RootState) =>
  state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.recordings;

export const getSelectedChatAudiosSelector = (state: RootState) => state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.audios;

export const getSelectedChatFilesSelector = (state: RootState) => state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.files;

export const getSelectedChatPhotosSelector = (state: RootState) => state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.photos;

export const getSelectedChatVideosSelector = (state: RootState) => state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.videos;

// -----------

export const getSelectedChatInterlocutorNameSelector = (state: RootState) => {
  const selectedChat = state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId);

  return selectedChat?.interlocutor ? `${selectedChat?.interlocutor?.firstName} ${selectedChat?.interlocutor?.lastName}` : selectedChat?.groupChat?.name;
};

export const getSelectedChatIdSelector = (state: RootState): number | null => state.chats.selectedChatId;

export const getChatByIdSelector = (chatId: number) => (state: RootState) => state.chats.chats.find(({ id }) => id === chatId);

export const getChatsSelector = (state: RootState): IChat[] => state.chats.chats;

export const getSearchChatsSelector = (state: RootState): IChat[] => state.chats.searchChats;

export const getChatsLoadingSelector = (state: RootState): boolean | undefined => state.chats.loading;

export const getHasMoreChatsSelector = (state: RootState): boolean => state.chats.hasMore;

export const getSearchStringSelector = (state: RootState) => state.chats.searchString;

export const getMembersForSelectedGroupChatSelector = (state: RootState) =>
  state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.members?.members;

export const getMemberIdsForSelectedGroupChatSelector = (state: RootState) =>
  state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.members?.members.map((user) => user.id) || [];

export const getMembersListForSelectedGroupChatSelector = (state: RootState) =>
  state.chats?.chats?.find((x: IChat) => x?.id === state?.chats?.selectedChatId)?.members;

export const getTypingStringSelector = (t: TFunction, chatId: number | null) => (state: RootState) => {
  const typingUsers = state.chats?.chats?.find(({ id }) => id === chatId)?.typingInterlocutors;

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

export const getIsSelectMessagesStateSelector = (state: RootState) => state.chats.selectedMessageIds.length > 0;

export const getSelectedMessagesIdSelector = (state: RootState) => state.chats.selectedMessageIds;

export const getMessageToEditSelector = (state: RootState) => state.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.messageToEdit;

export const getMessageToReplySelector = (state: RootState) => state.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.messageToReply;

export const getMessagesLoadingSelector = (state: RootState) => state.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.messages.loading;

export const getHasMoreMessagesMessagesSelector = (state: RootState) => state.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.messages.hasMore;

export const getMessagesByChatIdSelector = (state: RootState) => state.chats.chats.find(({ id }) => id === state.chats.selectedChatId)?.messages.messages;

export const getChatMessageByIdSelector = (messageId: number, chatId: number) => (state: RootState) =>
  state.chats.chats.find(({ id }) => id === chatId)?.messages.messages.find(({ id }) => id === messageId);

export const getChatHasMessageWithIdSelector = (messageId: number, chatId: number) => (state: RootState) =>
  state.chats.chats.find(({ id }) => id === chatId)?.messages.messages.findIndex(({ id }) => id === messageId) !== -1;

// IChatsState selectors
export const getChatExistsDraftSelector = (chatId: number, draft: IChatsState): boolean =>
  chatId !== null && Boolean(draft.chats.find(({ id }) => id === chatId));

export const getChatByIdDraftSelector = (chatId: number | null, draft: IChatsState) => draft.chats.find(({ id }) => id === chatId);

export const getMessageDraftSelector = (chatId: number | null, messageId: number, draft: IChatsState) =>
  draft.chats.find(({ id }) => id === chatId)?.messages.messages.find(({ id }) => id === messageId);

export const getChatIndexDraftSelector = (chatId: number, draft: IChatsState) => draft.chats.findIndex(({ id }) => id === chatId);
