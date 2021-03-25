import { IAvatar } from '../../../../common/models';

export interface IEditGroupChatActionPayload {
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
