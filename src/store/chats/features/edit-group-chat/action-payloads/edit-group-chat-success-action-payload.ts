import { IAvatar } from 'kimbu-models';

export interface IEditGroupChatSuccessActionPayload {
  chatId: string;
  name: string;
  description?: string;
  avatar?: IAvatar;
}
