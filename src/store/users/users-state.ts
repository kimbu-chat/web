import { IUser } from '@store/common/models';
import { ById } from '../chats/models/by-id';

export interface IUsersState {
  users: ById<IUser>;
}
