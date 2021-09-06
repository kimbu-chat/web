import { IAvatar } from 'kimbu-models';

export interface IUpdateMyProfileSuccessActionPayload {
  userId: string;
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
