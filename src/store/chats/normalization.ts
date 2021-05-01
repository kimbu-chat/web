import { IChat, IMessage } from '@store/chats/models';
import { IUser } from '@store/common/models';
import { schema } from 'normalizr';

// Define a users schema
const user = new schema.Entity<IUser>('users');

// Define your comments schema
export const messageNormalizationSchema = new schema.Entity<IMessage>('messages', {
  userCreator: user,
  linkedMessage: {
    userCreator: user,
  },
});

export const chatNormalizationSchema = new schema.Entity<IChat>('chats', {
  lastMessage: {
    userCreator: user,
    linkedMessage: {
      userCreator: user,
    },
  },
  interlocutor: user,
});

export const messageArrNormalizationSchema = new schema.Array<IMessage[]>(
  messageNormalizationSchema,
);

export const chatArrNormalizationSchema = new schema.Array<IChat[]>(chatNormalizationSchema);
