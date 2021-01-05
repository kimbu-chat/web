import { IUserPreview } from 'app/store/my-profile/models';

export interface IAddUsersToGroupChatSuccessActionPayload {
  users: IUserPreview[];
  chatId: number;
}
