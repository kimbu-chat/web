/* eslint-disable no-param-reassign */
import { ChatId } from '../chat-id';
import { INormalizedChat, InterlocutorType } from '../models';

export const modelChatList = (chats?: Record<number, INormalizedChat>) => {
  const modeledChats: Record<number, INormalizedChat> = {};
  if (chats) {
    Object.values(chats).forEach((initialChat: INormalizedChat | undefined) => {
      const chat = initialChat;

      if (chat) {
        chat.interlocutorType = ChatId.fromId(chat.id).interlocutorType;
        chat.typingInterlocutors = [];
        chat.photos = { photos: [], loading: false, hasMore: true };
        chat.videos = { videos: [], loading: false, hasMore: true };
        chat.files = { files: [], loading: false, hasMore: true };
        chat.audios = { audios: [], loading: false, hasMore: true };
        chat.draftMessage = '';
        chat.recordings = {
          hasMore: true,
          loading: false,
          recordings: [],
        };
        if (chat.interlocutorType === InterlocutorType.GroupChat) {
          chat.members = { memberIds: [], loading: false, hasMore: true };
          chat.possibleMembers = { data: [], loading: false, hasMore: true };
        }
        chat.messages = {
          messages: chat?.messages?.messages || {},
          messageIds: chat?.messages?.messageIds || [],
          hasMore: true,
          loading: false,
        };
        modeledChats[chat.id] = chat;
      }
    });
  }
  return modeledChats;
};
