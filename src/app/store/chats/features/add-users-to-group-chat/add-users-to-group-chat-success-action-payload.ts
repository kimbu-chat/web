import { UserPreview } from 'app/store/my-profile/models';
import { Chat } from '../../models';

export interface AddUsersToGroupChatSuccessActionPayload {
  users: UserPreview[];
  chat: Chat;
}
