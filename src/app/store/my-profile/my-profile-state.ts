import { IUser } from 'app/store/common/models';

export interface IMyProfileState {
  user?: IUser;
  isTabActive: boolean;
}
