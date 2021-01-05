import { IAvatar } from './avatar';
import { UserStatus } from './user-status';

export interface IUserPreview {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
  nickname: string;
  status: UserStatus;
  gender?: number;
  lastOnlineTime: Date;
  phoneNumber: string;

  supposedToAddIntoGroupChat?: boolean;
}
