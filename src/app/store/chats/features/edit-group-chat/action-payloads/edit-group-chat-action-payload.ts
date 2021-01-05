import { IAvatar } from 'app/store/models';

export interface IEditGroupChatActionPayload {
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
