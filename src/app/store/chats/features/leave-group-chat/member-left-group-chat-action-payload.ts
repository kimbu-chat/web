export interface MemberLeftGroupChatActionPayload {
  userId: number;
  groupChatId: number;
  isCurrentUserEventCreator: boolean;
}
