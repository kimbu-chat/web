import { UserPreview } from 'app/store/my-profile/models';
import { Chat } from '../../models';

export interface AddUsersToGroupChatActionPayload {
  users: UserPreview[];
  chat: Chat;
}
