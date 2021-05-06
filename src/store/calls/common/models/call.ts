import { IUser, CallStatus } from '@store/common/models';

export interface ICall {
  id: number;
  userInterlocutor: IUser;
  userCallerId: number;
  endDateTime?: Date;
  creationDateTime: Date;
  startDateTime: Date;
  status: CallStatus;
}

export interface INormalizedCall {
  id: number;
  userInterlocutorId: number;
  userCallerId: number;
  endDateTime?: Date;
  creationDateTime: Date;
  startDateTime: Date;
  status: CallStatus;
}
