export interface IGetGroupChatUsersSuccessActionPayload {
  chatId: string;
  isFromSearch?: boolean;
  hasMore: boolean;
  userIds: string[];
}
