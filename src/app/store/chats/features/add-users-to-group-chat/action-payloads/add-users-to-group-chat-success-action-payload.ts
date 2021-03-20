import { IUser } from '../../../../common/models';

export interface IAddUsersToGroupChatSuccessActionPayload {
  users: IUser[];
  chatId: number;
}
