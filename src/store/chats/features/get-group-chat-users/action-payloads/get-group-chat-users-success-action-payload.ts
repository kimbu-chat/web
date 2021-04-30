export interface IGetGroupChatUsersSuccessActionPayload {
  chatId: number;
  isFromSearch?: boolean;
  hasMore: boolean;
  userIds: number[];
}
