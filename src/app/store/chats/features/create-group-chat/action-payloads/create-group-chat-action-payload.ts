import { IUserPreview, IAvatar } from 'app/store/models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUser: IUserPreview;
  avatar?: IAvatar | null;
}
