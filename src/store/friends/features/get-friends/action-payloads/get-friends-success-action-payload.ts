export interface IGetFriendsSuccessActionPayload {
  friendIds: number[];
  name?: string;
  initializedByScroll?: boolean;
  hasMore: boolean;
}
