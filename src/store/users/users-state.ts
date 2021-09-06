import { IUser } from 'kimbu-models';

export interface IUsersState {
  users: Record<string, IUser>;
}
