import { IAvatar } from '@store/common/models';

export interface IUpdateMyProfileSuccessActionPayload {
  userId: number;
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
