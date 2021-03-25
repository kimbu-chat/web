import { IAvatar } from '../../../../common/models';

export interface IUpdateMyProfileSuccessActionPayload {
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
