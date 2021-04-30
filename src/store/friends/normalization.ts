import { IUser } from '@store/common/models';
import { schema } from 'normalizr';

// Define a users schema
const user = new schema.Entity<IUser>('users');

export const userArrNormalizationSchema = new schema.Array<IUser[]>(user);
