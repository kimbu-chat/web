import { IUser } from '../common/models';

export interface IMyProfileState {
  user?: IUser;
  deviceId?: string;
  isTabActive: boolean;
}
