import { IUploadBaseResponse } from './base-upload-api-response';

export interface IUploadAudioApiResponse extends IUploadBaseResponse {
  title: string;
  duration: number;
}
