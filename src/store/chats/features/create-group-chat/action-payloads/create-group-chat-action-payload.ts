import { IAvatar } from '../../../../common/models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUserId: number;
  avatar?: IAvatar | null;
}
