import { TFunction } from 'i18next';
import { RootState } from '../root-reducer';
import { Chat } from './models';

export const getSelectedChatSelector = (state: RootState): Chat | undefined =>
  state.chats?.chats?.find((x: Chat) => x?.id === state?.chats?.selectedChatId) || undefined;

export const getSelectedChatIdSelector = (state: RootState): number | undefined => state.chats.selectedChatId;

export const getChatById = (chatId: number) => (state: RootState) => state.chats.chats.find(({ id }) => id === chatId);

export const getChats = (state: RootState): Chat[] => state.chats.chats;

export const getHasMoreChats = (state: RootState): boolean => state.chats.hasMore;

export const getSearchString = (state: RootState) => state.chats.searchString;

export const getMembersForSelectedGroupChat = (state: RootState) => state.chats?.chats?.find((x: Chat) => x?.id === state?.chats?.selectedChatId)?.members;

export const getSearchMembersForSelectedGroupChat = (state: RootState) =>
  state.chats?.chats?.find((x: Chat) => x?.id === state?.chats?.selectedChatId)?.searchMembers;

export const getTypingString = (t: TFunction, chat: Chat): string | undefined => {
  const typingUsers = chat?.typingInterlocutors;
  if (typingUsers) {
    if (typingUsers.length === 1) {
      return t('chat.typing', { firstInterlocutorName: typingUsers[0].fullName.split(' ')[0] });
    }
    if (typingUsers.length === 2) {
      return t('chat.typing_two', {
        firstInterlocutorName: typingUsers[0].fullName.split(' ')[0],
        secondInterlocutorName: typingUsers[1].fullName.split(' ')[0],
      });
    }
    if (typingUsers.length > 2) {
      return t('chat.typing_many', {
        firstInterlocutorName: typingUsers[0].fullName.split(' ')[0],
        secondInterlocutorName: typingUsers[1].fullName.split(' ')[0],
        remainingCount: typingUsers.length - 2,
      });
    }
  }

  return undefined;
};
