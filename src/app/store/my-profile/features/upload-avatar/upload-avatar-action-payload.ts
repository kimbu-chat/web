export interface UploadAvatarActionPayload {
  pathToFile: string;
  onProgress?: (progress: number) => void;
}
