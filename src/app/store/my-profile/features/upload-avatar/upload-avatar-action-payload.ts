export interface IUploadAvatarActionPayload {
  pathToFile: string;
  onProgress?: (progress: number) => void;
}
