import { IChat, IMessage, ILinkedMessage, IUser } from 'kimbu-models';
import { schema } from 'normalizr';

import {
  INormalizedChat,
  INormalizedLinkedMessage,
  INormalizedMessage,
  MessageState,
} from '@store/chats/models';

import { ChatId } from './chat-id';

const userSchema = new schema.Entity<IUser>('users');

export const linkedMessageNormalizationSchema = new schema.Entity<ILinkedMessage>(
  'linkedMessages',
  {
    userCreator: userSchema,
  },
);

export const messageNormalizationSchema = new schema.Entity<INormalizedLinkedMessage>(
  'messages',
  {
    userCreator: userSchema,
    linkedMessage: {
      userCreator: userSchema,
    },
  },
  {
    processStrategy: (message: IMessage) => ({
      ...message,
      userCreatorId: message.userCreator?.id || message.userCreatorId,
    }),
  },
);

export const chatNormalizationSchema = new schema.Entity<INormalizedChat>(
  'chats',
  {
    lastMessage: messageNormalizationSchema,
    interlocutor: userSchema,
  },
  {
    processStrategy: (chat: IChat) => {
      const normalizedChat: INormalizedChat = {
        ...chat,
        interlocutorId: chat?.interlocutor?.id,
        lastMessageId: chat?.lastMessage?.id,
        interlocutorType: ChatId.fromId(chat.id).interlocutorType,
        typingInterlocutors: [],
        photos: { data: [], loading: false, hasMore: true },
        videos: { data: [], loading: false, hasMore: true },
        files: { data: [], loading: false, hasMore: true },
        audios: { data: [], loading: false, hasMore: true },
        members: { memberIds: [], loading: false, hasMore: true },
        possibleMembers: { memberIds: [], loading: false, hasMore: true },
        recordings: {
          hasMore: true,
          loading: false,
          data: [],
        },
        messages: chat.lastMessage
          ? {
              messages: {
                [chat.lastMessage.id]: {
                  ...chat.lastMessage,
                  state:
                    chat.interlocutorLastReadMessageId &&
                    chat.interlocutorLastReadMessageId >= chat.lastMessage.id
                      ? MessageState.READ
                      : MessageState.SENT,
                } as unknown as INormalizedMessage,
              },
              messageIds: [chat.lastMessage.id],
              loading: false,
              hasMore: true,
            }
          : {
              messages: {},
              messageIds: [],
              loading: false,
              hasMore: false,
            },
      };

      return normalizedChat;
    },
  },
);

export const messageArrNormalizationSchema = new schema.Array<IMessage[]>(
  messageNormalizationSchema,
);

export const chatArrNormalizationSchema = new schema.Array<IChat[]>(chatNormalizationSchema);
