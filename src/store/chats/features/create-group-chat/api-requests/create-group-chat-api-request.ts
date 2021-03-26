export interface ICerateGroupChatApiRequest {
  name: string;
  description?: string;
  userIds: number[];
  avatarId?: number | null;
}
