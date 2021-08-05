import { IUser } from 'kimbu-models';
import { schema } from 'normalizr';

export const userSchema = new schema.Entity<IUser>('users');

export const userArrNormalizationSchema = new schema.Array<IUser[]>(userSchema);
