import { ById } from '../../../../chats/models/by-id';
import { IUser } from '../../../../common/models/user';

export interface IAddOrUpdateUsersActionPayload {
  users: ById<IUser>;
}
