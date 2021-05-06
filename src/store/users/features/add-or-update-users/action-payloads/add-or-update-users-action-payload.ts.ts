import { IUser } from '../../../../common/models/user';
import { ById } from '../../../../chats/models/by-id';

export interface IAddOrUpdateUsersActionPayload {
  users: ById<IUser>;
}
