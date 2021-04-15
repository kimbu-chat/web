import { IAvatar } from './avatar';
import { UserStatus } from './user-status';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
  nickname: string;
  status: UserStatus;
  gender?: number;
  lastOnlineTime: Date;
  phoneNumber: string;
  deactivated?: boolean;
}
