import { CallStatus } from '@store/common/models/call-status';

import type { IUser } from '@store/common/models';

export interface ICall {
  id: number;
  userInterlocutor: IUser;
  userCallerId: number;
  endDateTime?: string;
  creationDateTime: string;
  startDateTime: string;
  status: CallStatus;
}

export interface INormalizedCall {
  id: number;
  userInterlocutorId: number;
  userCallerId: number;
  endDateTime?: string;
  creationDateTime: string;
  startDateTime: string;
  status: CallStatus;
}
