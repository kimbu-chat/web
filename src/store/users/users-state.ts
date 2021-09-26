import { IUser } from 'kimbu-models';

export interface IUsersState {
  users: Record<number, IUser>;
}
