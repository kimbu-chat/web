import { IAvatar } from '../../models';

export interface IUpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
}
