import { CallStatus, IUser } from 'app/store/common/models';

export interface ICall {
  id: number;
  userInterlocutor: IUser;
  userCallerId: number;
  duration?: number;
  status: CallStatus;
}
