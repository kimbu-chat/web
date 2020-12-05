import { RootState } from 'app/store/root-reducer';
import { MessagesState, Message } from './models';

export const getSelectedMessagesLength = (state: RootState): number => state.messages.selectedMessageIds.length;

export const checkIfChatExists = (state: MessagesState, chatId: number): boolean =>
  state.messages && state.messages.length > 0 && state?.messages?.findIndex((x) => x.chatId === chatId) > -1;
export const getChatIndex = (state: MessagesState, chatId: number): number => state?.messages?.findIndex((x) => x.chatId === chatId);

export const getMessage = (messages: Message[], messageId: number) => messages.find(({ id }) => id === messageId);
