import { IAvatar } from 'kimbu-models';

export interface IEditGroupChatActionPayload {
  name: string;
  description?: string;
  avatar?: IAvatar;
}
