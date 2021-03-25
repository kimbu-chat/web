import { IUser } from '../../../../common/models';

export interface IGetMyProfileSuccessActionPayload {
  user: IUser;
  deviceId?: string;
}
