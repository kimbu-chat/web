import { ICall } from '@store/calls/common/models';
import { IUser } from '@store/common/models';
import { schema } from 'normalizr';

// Define a users schema
const user = new schema.Entity<IUser>('users');

// Define your comments schema
export const callNormalizationSchema = new schema.Entity<ICall>('calls', {
  userInterlocutor: user,
});

export const callArrNormalizationSchema = new schema.Array<ICall[]>(callNormalizationSchema);
