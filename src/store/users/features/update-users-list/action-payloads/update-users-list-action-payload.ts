import { IUser } from '../../../../common/models/user';
import { ById } from '../../../../chats/models/by-id';

export interface IUpdateUsersListActionPayload {
  users: ById<IUser>;
}
