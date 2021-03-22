import { IAvatar } from '../../../../common/models';

export interface IUpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
