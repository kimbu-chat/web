import { ChatId } from '../chat-id';
import { INormalizedChat } from '../models';

export const modelChatList = (
  chats: Record<number, INormalizedChat> = {},
): Record<number, INormalizedChat> =>
  Object.values(chats).reduce<Record<number, INormalizedChat>>(
    (curr, initialChat: INormalizedChat) => {
      const newChat = {
        ...initialChat,
        interlocutorType: ChatId.fromId(initialChat.id).interlocutorType,
        typingInterlocutors: [],
        photos: { photos: [], loading: false, hasMore: true },
        videos: { videos: [], loading: false, hasMore: true },
        files: { files: [], loading: false, hasMore: true },
        audios: { audios: [], loading: false, hasMore: true },
        members: { memberIds: [], loading: false, hasMore: true },
        possibleMembers: { data: [], loading: false, hasMore: true },
        draftMessage: '',
        recordings: {
          hasMore: true,
          loading: false,
          recordings: [],
        },
        messages: {
          messages: initialChat.messages?.messages || {},
          messageIds: initialChat.messages?.messageIds || [],
          hasMore: true,
          loading: false,
        },
      };

      return {
        ...curr,
        [initialChat.id]: newChat,
      };
    },
    {},
  );
