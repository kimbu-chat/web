export interface UpdateMyProfileActionPayload {
  firstName: string;
  lastName: string;
  avatar?: { url: string; previewUrl: string; id: string };
}
