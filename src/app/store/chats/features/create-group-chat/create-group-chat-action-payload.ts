import { UploadAvatarResponse, UserPreview } from 'app/store/my-profile/models';

export interface CreateGroupChatActionPayload {
  name: string;
  description?: string;
  userIds: Array<number>;
  currentUser: UserPreview;
  avatar?: UploadAvatarResponse | null;
}
