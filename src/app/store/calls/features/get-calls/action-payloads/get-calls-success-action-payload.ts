import { ICall } from 'app/store/calls/common/models';

export interface IGetCallsSuccessActionPayload {
  calls: ICall[];
  hasMore: boolean;
}
