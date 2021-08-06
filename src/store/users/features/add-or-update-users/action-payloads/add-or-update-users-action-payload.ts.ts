import { IUser } from 'kimbu-models';

import { ById } from '../../../../chats/models/by-id';

export interface IAddOrUpdateUsersActionPayload {
  users: ById<IUser>;
}
