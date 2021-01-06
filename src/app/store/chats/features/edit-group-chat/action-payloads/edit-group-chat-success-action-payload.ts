import { IAvatar } from 'app/store/models';

export interface IEditGroupChatSuccessActionPayload {
  chatId: number;
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
