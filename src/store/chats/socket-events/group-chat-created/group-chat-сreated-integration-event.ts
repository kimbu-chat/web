import { IUser } from 'kimbu-models';

export interface IGroupChatCreatedIntegrationEvent {
  description?: string;
  id: string;
  memberIds: string[];
  name: string;
  systemMessageId: string;
  userCreator: IUser;
  userCreatorId: string;
  avatarId?: number;
  avatarUrl?: string;
  avatarPreviewUrl?: string;
}
