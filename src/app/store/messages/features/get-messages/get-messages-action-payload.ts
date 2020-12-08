import { Chat } from 'app/store/chats/models';
import { Page } from 'app/store/common/models';

export interface GetMessagesActionPayload {
  page: Page;
  chat: Chat;
}
