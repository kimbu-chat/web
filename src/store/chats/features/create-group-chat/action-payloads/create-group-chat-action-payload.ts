import { IAvatar } from 'kimbu-models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: number[];
  currentUserId: number;
  avatar?: IAvatar;
}
