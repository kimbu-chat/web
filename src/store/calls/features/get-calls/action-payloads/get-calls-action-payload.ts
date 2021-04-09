import { IPage } from '../../../../common/models';

export interface IGetCallsActionPayload {
  page: IPage;
  initializedByScroll: boolean;
  name?: string;
}
