import { IAvatar } from 'kimbu-models';

export interface IEditGroupChatSuccessActionPayload {
  chatId: number;
  name: string;
  description?: string;
  avatar?: IAvatar;
}
