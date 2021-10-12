import { IAvatar } from 'kimbu-models';

export interface IUpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  nickname: string;
  avatar?: IAvatar;
}
