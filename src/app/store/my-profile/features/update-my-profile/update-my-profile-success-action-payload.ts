export interface UpdateMyProfileSuccessActionPayload {
  firstName: string;
  lastName: string;
  avatar?: { url: string; previewUrl: string; id: string };
}
