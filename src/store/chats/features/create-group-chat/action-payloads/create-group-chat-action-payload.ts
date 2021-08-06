import { IAvatar } from 'kimbu-models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUserId: number;
  avatar?: IAvatar;
}
