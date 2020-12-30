import { IAvatar } from 'app/store/my-profile/models';

export interface IEditGroupChatSuccessActionPayload {
  id: number;
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
