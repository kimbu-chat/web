import { IAvatar } from 'app/store/models';

export interface IUpdateMyProfileSuccessActionPayload {
  firstName: string;
  lastName: string;
  avatar?: IAvatar;
}
