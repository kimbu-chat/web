import { IUser, IAvatar } from 'app/store/common/models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUser: IUser;
  avatar?: IAvatar | null;
}
