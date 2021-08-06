import { IUser } from 'kimbu-models';

import { ById } from '../chats/models/by-id';

export interface IUsersState {
  users: ById<IUser>;
}
