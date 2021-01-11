import { ICall } from 'app/store/calls/models';

export interface IGetCallsSuccessActionPayload {
  calls: ICall[];
  hasMore: boolean;
}
