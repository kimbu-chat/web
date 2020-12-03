import { ChatsState } from './models';

export const checkChatExists = (chatId: number, state: ChatsState): boolean => Boolean(state.chats.find(({ id }) => id === chatId));

export const getChatArrayIndex = (chatId: number, state: ChatsState): number => state.chats.findIndex(({ id }) => id === chatId);
