import { IUser } from '../common/models';

export interface IMyProfileState {
  user?: IUser;
  isTabActive: boolean;
}
