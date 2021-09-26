import { IUser } from 'kimbu-models';

export interface IAddOrUpdateUsersActionPayload {
  users: Record<number, IUser>;
}
