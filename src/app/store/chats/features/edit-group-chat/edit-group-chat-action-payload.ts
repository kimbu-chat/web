import { IAvatar } from 'app/store/my-profile/models';

export interface IEditGroupChatActionPayload {
  id: number;
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
