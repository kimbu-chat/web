import { IAvatar } from '../../../../common/models';

export interface IEditGroupChatSuccessActionPayload {
  chatId: number;
  name: string;
  description?: string;
  avatar: IAvatar | null;
}
