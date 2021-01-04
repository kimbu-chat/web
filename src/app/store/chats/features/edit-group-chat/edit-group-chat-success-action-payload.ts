import { IAvatar } from 'app/store/my-profile/models';

export interface IEditGroupChatSuccessActionPayload {
  chatId: number;
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
