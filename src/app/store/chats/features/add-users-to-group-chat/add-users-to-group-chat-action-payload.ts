import { IUserPreview } from 'app/store/my-profile/models';
import { IChat } from '../../models';

export interface IAddUsersToGroupChatActionPayload {
  users: IUserPreview[];
  chat: IChat;
}
