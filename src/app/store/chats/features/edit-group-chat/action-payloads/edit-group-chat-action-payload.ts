import { IAvatar } from 'app/store/common/models';

export interface IEditGroupChatActionPayload {
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
