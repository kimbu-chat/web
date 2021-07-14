import { schema } from 'normalizr';

import { IUser } from '@store/common/models';

export const userSchema = new schema.Entity<IUser>('users');

export const userArrNormalizationSchema = new schema.Array<IUser[]>(userSchema);
