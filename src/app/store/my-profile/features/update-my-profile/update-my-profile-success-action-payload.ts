import { IAvatar } from '../../models';

export interface IUpdateMyProfileSuccessActionPayload {
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
}
