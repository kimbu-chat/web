import { IUserPreview } from 'app/store/my-profile/models';
import { IChat } from '../../models';

export interface IAddUsersToGroupChatSuccessActionPayload {
  users: IUserPreview[];
  chat: IChat;
}
