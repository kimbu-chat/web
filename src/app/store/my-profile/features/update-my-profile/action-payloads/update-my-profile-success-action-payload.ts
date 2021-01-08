import { IAvatar } from 'app/store/models';

export interface IUpdateMyProfileSuccessActionPayload {
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
