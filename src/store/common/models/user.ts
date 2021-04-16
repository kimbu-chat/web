import { IAvatar } from './avatar';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
  nickname: string;
  online: boolean;
  gender?: number;
  lastOnlineTime: Date;
  phoneNumber: string;
  deactivated?: boolean;
}
