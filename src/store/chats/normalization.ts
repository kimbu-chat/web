import { schema } from 'normalizr';

import { ILinkedMessage } from '@store/chats/models/linked-message';
import { IChat, IMessage } from '@store/chats/models';
import { IUser } from '@store/common/models';

const user = new schema.Entity<IUser>('users');

export const linkedMessageNormalizationSchema = new schema.Entity<ILinkedMessage>(
  'linkedMessages',
  {
    userCreatorId: user,
  },
  {
    processStrategy: (linkedMessage) => ({
      ...linkedMessage,
      userCreatorId: linkedMessage.userCreator,
      userCreator: undefined,
    }),
  },
);

export const messageNormalizationSchema = new schema.Entity<IMessage>(
  'messages',
  {
    userCreatorId: user,
    linkedMessage: {
      userCreatorId: user,
    },
  },
  {
    processStrategy: (message) => ({
      ...message,
      linkedMessage: message?.linkedMessage
        ? {
            ...message?.linkedMessage,
            userCreator: undefined,
            userCreatorId: message?.linkedMessage?.userCreator,
          }
        : undefined,
      userCreatorId: message.userCreator,
      userCreator: undefined,
    }),
  },
);

export const chatNormalizationSchema = new schema.Entity<IChat>(
  'chats',
  {
    lastMessage: {
      userCreatorId: user,
      linkedMessage: {
        userCreatorId: user,
      },
    },
    interlocutorId: user,
  },
  {
    processStrategy: (chat) => ({
      ...chat,
      interlocutorId: chat.interlocutor,
      interlocutor: undefined,
      lastMessage: chat.lastMessage
        ? {
            ...chat.lastMessage,
            linkedMessage: chat.lastMessage?.linkedMessage
              ? {
                  ...chat.lastMessage?.linkedMessage,
                  userCreator: undefined,
                  userCreatorId: chat.lastMessage?.linkedMessage?.userCreator,
                }
              : undefined,
            userCreator: undefined,
            userCreatorId: chat.lastMessage?.userCreator,
          }
        : undefined,
    }),
  },
);

export const messageArrNormalizationSchema = new schema.Array<IMessage[]>(
  messageNormalizationSchema,
);

export const chatArrNormalizationSchema = new schema.Array<IChat[]>(chatNormalizationSchema);
