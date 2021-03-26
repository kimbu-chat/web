import { IUser, IAvatar } from '../../../../common/models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUser: IUser;
  avatar?: IAvatar | null;
}