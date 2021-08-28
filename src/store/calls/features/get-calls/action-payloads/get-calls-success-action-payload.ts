import { INormalizedCall } from '../../../common/models';

export interface IGetCallsSuccessActionPayload {
  calls: Record<number, INormalizedCall>;
  callIds: number[];
  hasMore: boolean;
  initializedByScroll: boolean;
  name?: string;
}
