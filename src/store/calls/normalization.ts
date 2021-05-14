import { schema } from 'normalizr';

import { ICall } from '@store/calls/common/models';
import { IUser } from '@store/common/models';

const user = new schema.Entity<IUser>('users');

export const callNormalizationSchema = new schema.Entity<ICall>(
  'calls',
  {
    userInterlocutorId: user,
  },
  {
    processStrategy: (call) => ({
      ...call,
      userInterlocutor: undefined,
      userInterlocutorId: call.userInterlocutor,
    }),
  },
);

export const callArrNormalizationSchema = new schema.Array<ICall[]>(callNormalizationSchema);
