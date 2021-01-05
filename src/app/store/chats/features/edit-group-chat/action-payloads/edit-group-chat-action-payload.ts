import { IAvatar } from 'app/store/my-profile/models';

export interface IEditGroupChatActionPayload {
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
