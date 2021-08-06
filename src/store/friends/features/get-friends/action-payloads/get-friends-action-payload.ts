import { IPaginationParams } from 'kimbu-models';

export interface IGetFriendsActionPayload {
  page: IPaginationParams;
  name?: string;
  initializedByScroll?: boolean;
}
