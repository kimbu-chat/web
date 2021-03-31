import { CallStatus, IUser } from '../../../common/models';

export interface ICall {
  id: number;
  userInterlocutor: IUser;
  userCallerId: number;
  endDateTime?: Date;
  creationDateTime: Date;
  startDateTime: Date;
  status: CallStatus;
}
