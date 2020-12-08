export interface EditGroupChatActionPayload {
  id: number;
  name: string;
  description?: string;
  avatar: {
    id: string;
    url: string;
    previewUrl: string;
  } | null;
}
