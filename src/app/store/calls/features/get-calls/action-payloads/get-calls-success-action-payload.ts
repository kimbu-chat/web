import { ICall } from '../../../models';

export interface IGetCallsSuccessActionPayload {
  calls: ICall[];
  hasMore: boolean;
}
