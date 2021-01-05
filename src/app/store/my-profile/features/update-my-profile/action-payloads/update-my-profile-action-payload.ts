import { IAvatar } from 'app/store/models';

export interface IUpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
}
