import { CallStatus, IUser } from '../../../common/models';

export interface ICall {
  id: number;
  userInterlocutor: IUser;
  userCallerId: number;
  duration: number;
  status: CallStatus;
}
