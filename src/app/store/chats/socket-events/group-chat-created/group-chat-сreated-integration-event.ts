import { IUser } from 'app/store/common/models';

export interface IGroupChatCreatedIntegrationEvent {
  description?: string;
  id: number;
  memberIds: number[];
  name: string;
  systemMessageId: number;
  userCreator: IUser;
  userCreatorId: number;
  avatarId?: number;
  avatarUrl?: string;
  avatarPreviewUrl?: string;
}
