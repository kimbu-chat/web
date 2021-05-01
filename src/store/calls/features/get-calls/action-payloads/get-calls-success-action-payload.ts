import { ById } from '@store/chats/models/by-id';
import { ICall } from '../../../common/models';

export interface IGetCallsSuccessActionPayload {
  calls: ById<ICall>;
  callIds: number[];
  hasMore: boolean;
  initializedByScroll: boolean;
  name?: string;
}
