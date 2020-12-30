import { RootState } from 'app/store/root-reducer';
import { IMessagesState, IMessage } from './models';

export const getSelectedMessagesLength = (state: RootState): number => state.messages.selectedMessageIds.length;

export const getMessageToEdit = (state: RootState) => state.messages.messageToEdit;

export const getMessageToReply = (state: RootState) => state.messages.messageToReply;

export const getSelectedMessagesId = (state: RootState) => state.messages.selectedMessageIds;

export const getMessagesLoading = (state: RootState) => state.messages.loading;

export const getMessagesByChatId = (messagesChatId: number) => (state: RootState) => state.messages.messages.find(({ chatId }) => chatId === messagesChatId);

export const getLastMessageByChatId = (messagesChatId: number) => (state: RootState) => {
  const messagesForChat = state.messages.messages.find(({ chatId }) => chatId === messagesChatId)?.messages;

  return messagesForChat ? messagesForChat[0] : undefined;
};

export const checkIfChatExists = (state: IMessagesState, chatId: number): boolean =>
  chatId !== null && state.messages && state.messages.length > 0 && state?.messages?.findIndex((x) => x.chatId === chatId) !== -1;

export const getChatIndex = (state: IMessagesState, chatId: number): number => state?.messages?.findIndex((x) => x.chatId === chatId);

export const getMessage = (messages: IMessage[], messageId: number) => messages.find(({ id }) => id === messageId);
