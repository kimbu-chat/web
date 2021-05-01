import { CallStatus } from '../../../common/models';

export interface ICall {
  id: number;
  userInterlocutor: number;
  userCallerId: number;
  endDateTime?: Date;
  creationDateTime: Date;
  startDateTime: Date;
  status: CallStatus;
}
