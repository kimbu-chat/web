import { ICall } from '../../../common/models';

export interface IGetCallsSuccessActionPayload {
  calls: ICall[];
  hasMore: boolean;
  initializedByScroll: boolean;
  name?: string;
}
