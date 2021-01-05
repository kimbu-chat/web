import { CallStatus } from 'app/store/models';
import { IUserPreview } from 'app/store/my-profile/models';

export interface ICall {
  id: number;
  userInterlocutor: IUserPreview;
  userCallerId: number;
  duration: number;
  status: CallStatus;
}
