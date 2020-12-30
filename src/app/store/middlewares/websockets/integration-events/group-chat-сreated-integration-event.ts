import { IUserPreview } from 'store/my-profile/models';

export interface IGroupChatCreatedIntegrationEvent {
  userCreator: IUserPreview;
  name: string;
  memberIds: Array<number>;
  systemMessageId: number;
  id: number;
}
