import { IUploadAvatarResponse, IUserPreview } from 'app/store/my-profile/models';

export interface ICreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUser: IUserPreview;
  avatar?: IUploadAvatarResponse | null;
}
