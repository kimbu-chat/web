import { IUser } from 'kimbu-models';

export interface IAddOrUpdateUsersActionPayload {
  users: Record<string, IUser>;
}
