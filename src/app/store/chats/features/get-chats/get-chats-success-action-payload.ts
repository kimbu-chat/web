import { IChatList } from '../../models';

export interface IGetChatsSuccessActionPayload extends IChatList {
  initializedBySearch: boolean;
}
