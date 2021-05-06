import { ById } from '@store/chats/models/by-id';
import { INormalizedCall } from '../../../common/models';

export interface IGetCallsSuccessActionPayload {
  calls: ById<INormalizedCall>;
  callIds: number[];
  hasMore: boolean;
  initializedByScroll: boolean;
  name?: string;
}
