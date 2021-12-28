import { IChat, IMessage, ILinkedMessage, IUser } from 'kimbu-models';
import { schema } from 'normalizr';

import { INormalizedLinkedMessage } from '@store/chats/models';
import { INormalizedRawChat } from '@store/chats/models/chat';

const userSchema = new schema.Entity<IUser>('users');

export const linkedMessageNormalizationSchema = new schema.Entity<ILinkedMessage>(
  'linkedMessages',
  {
    userCreator: userSchema,
  }
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
      userCreatorId: message.userCreator?.id  || message.userCreatorId,
    }),
  },
);


export const chatNormalizationSchema = new schema.Entity<INormalizedRawChat>(
  'chats',
  {
    lastMessage: messageNormalizationSchema,
    interlocutor: userSchema,
  },
  {
    processStrategy: (chat: IChat) => {
      const messages = chat.lastMessage ? {
        messages: {[chat?.lastMessage?.id]: chat?.lastMessage},
        messageIds: [chat?.lastMessage.id]
      } : {};

      return ({
        ...chat,
        interlocutorId: chat?.interlocutor?.id,
        lastMessageId: chat?.lastMessage?.id,
        draftMessages: {},
        messages,
      });
    }
  },
);

export const messageArrNormalizationSchema = new schema.Array<IMessage[]>(
  messageNormalizationSchema,
);

export const chatArrNormalizationSchema = new schema.Array<IChat[]>(chatNormalizationSchema);
