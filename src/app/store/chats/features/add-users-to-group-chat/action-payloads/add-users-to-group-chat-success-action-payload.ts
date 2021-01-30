import { IUser } from 'app/store/common/models';

export interface IAddUsersToGroupChatSuccessActionPayload {
  users: IUser[];
  chatId: number;
}
