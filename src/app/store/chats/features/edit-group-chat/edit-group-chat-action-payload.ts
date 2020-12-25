import { Avatar } from 'app/store/my-profile/models';

export interface EditGroupChatActionPayload {
  id: number;
  name: string;
  description?: string;
  avatar: Avatar | null;
}
