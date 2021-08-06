import { IChat, IMessage, ILinkedMessage, IUser } from 'kimbu-models';
import { schema } from 'normalizr';

const userSchema = new schema.Entity<IUser>('users');

export const linkedMessageNormalizationSchema = new schema.Entity<ILinkedMessage>(
  'linkedMessages',
  {
    userCreatorId: userSchema,
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
    userCreatorId: userSchema,
    linkedMessage: {
      userCreatorId: userSchema,
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
      userCreatorId: message.userCreator ? message.userCreator : message.userCreatorId,
      userCreator: undefined,
    }),
  },
);

export const chatNormalizationSchema = new schema.Entity<IChat>(
  'chats',
  {
    lastMessage: {
      userCreatorId: userSchema,
      linkedMessage: {
        userCreatorId: userSchema,
      },
    },
    interlocutorId: userSchema,
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
