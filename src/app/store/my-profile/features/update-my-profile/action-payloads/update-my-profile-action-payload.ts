import { IAvatar } from 'app/store/common/models';

export interface IUpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
