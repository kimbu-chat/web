import { IAvatar } from 'app/store/models';

export interface IUpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
