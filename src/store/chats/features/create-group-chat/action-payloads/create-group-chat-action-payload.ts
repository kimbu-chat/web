import { IAvatar } from 'kimbu-models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: string[];
  currentUserId: string;
  avatar?: IAvatar;
}
