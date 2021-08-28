export interface IGetFriendsSuccessActionPayload {
  friendIds: string[];
  name?: string;
  initializedByScroll?: boolean;
  hasMore: boolean;
}
