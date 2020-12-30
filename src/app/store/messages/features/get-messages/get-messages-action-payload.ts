import { IChat } from 'app/store/chats/models';
import { IPage } from 'app/store/common/models';

export interface IGetMessagesActionPayload {
  page: IPage;
  chat: IChat;
}
