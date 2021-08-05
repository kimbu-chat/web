import { IPaginationParams } from 'kimbu-models';

export interface IGetCallsActionPayload {
  page: IPaginationParams;
  initializedByScroll: boolean;
  name?: string;
}
