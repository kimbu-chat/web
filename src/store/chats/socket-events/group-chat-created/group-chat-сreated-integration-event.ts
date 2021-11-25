import { IUser } from 'kimbu-models';

export interface IGroupChatCreatedIntegrationEvent {
  description?: string;
  id: number;
  memberIds: number[];
  name: string;
  userCreator: IUser;
  userCreatorId: number;
  avatarId?: number;
  avatarUrl?: string;
  avatarPreviewUrl?: string;
}
