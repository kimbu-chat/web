import produce from 'immer';

import { ChatId } from '../chat-id';
import { IChat, MessageState, InterlocutorType } from '../models';

export const modelChatList = (chats: IChat[]) => {
  const nextState = produce(chats, (draft) => {
    draft.map((chat: IChat) => {
      if (chat.lastMessage) {
        chat.lastMessage.state =
          chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= Number(chat?.lastMessage?.id)
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
        chat.members = { members: [], loading: false, hasMore: true };
      }

      return chat;
    });
  });

  return nextState;
};
