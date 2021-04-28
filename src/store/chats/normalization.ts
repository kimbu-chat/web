import { IUser } from '@store/common/models';
import { schema } from 'normalizr';
import { IMessage } from './models';

// Define a users schema
const user = new schema.Entity<IUser>('users');

// Define your comments schema
export const messageNormalizationSchema = new schema.Entity<IMessage>('messages', {
  userCreator: user,
});

// Define your article
export const messageArrNormalizationSchema = new schema.Array<IMessage[]>(
  messageNormalizationSchema,
);
