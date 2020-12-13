import { Call } from '../../models';

export interface GetCallsSuccessActionPayload {
  calls: Call[];
  hasMore: boolean;
}
