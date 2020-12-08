import { ChatList } from '../../models';

export interface GetChatsSuccessActionPayload extends ChatList {
  initializedBySearch: boolean;
}
