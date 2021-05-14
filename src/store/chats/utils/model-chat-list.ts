import { ById } from '../models/by-id';
/* eslint-disable no-param-reassign */
import { ChatId } from '../chat-id';
import { MessageState, InterlocutorType, INormalizedChat } from '../models';

export const modelChatList = (chats?: ById<INormalizedChat>) => {
  const modeledChats: ById<INormalizedChat> = {};
  if (chats) {
    Object.values(chats).forEach((initialChat: INormalizedChat | undefined) => {
      const chat = initialChat;

      if (chat) {
        if (chat.lastMessage) {
          chat.lastMessage.state =
            chat.interlocutorLastReadMessageId &&
            chat.interlocutorLastReadMessageId >= Number(chat?.lastMessage?.id)
              ? (MessageState.READ as MessageState)
              : (MessageState.SENT as MessageState);
        }
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
        }
        chat.messages = {
          messages: {},
          messageIds: [],
          hasMore: true,
          loading: false,
        };
        modeledChats[chat.id] = chat;
      }
    });
  }
  return modeledChats;
};
