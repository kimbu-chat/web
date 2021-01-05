import { IUserPreview } from 'app/store/models';

export interface IAddUsersToGroupChatSuccessActionPayload {
  users: IUserPreview[];
  chatId: number;
}
