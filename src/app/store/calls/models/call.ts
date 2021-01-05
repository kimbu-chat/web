import { CallStatus, IUserPreview } from 'app/store/models';

export interface ICall {
  id: number;
  userInterlocutor: IUserPreview;
  userCallerId: number;
  duration: number;
  status: CallStatus;
}
