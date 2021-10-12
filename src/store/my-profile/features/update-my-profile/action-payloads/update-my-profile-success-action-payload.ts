import { IAvatar } from 'kimbu-models';

export interface IUpdateMyProfileSuccessActionPayload {
  userId: number;
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
