import { IUserPreview } from 'app/store/models';

export interface IGroupChatCreatedIntegrationEvent {
  description?: string;
  id: number;
  memberIds: number[];
  name: string;
  systemMessageId: number;
  userCreator: IUserPreview;
  userCreatorId: number;
}
