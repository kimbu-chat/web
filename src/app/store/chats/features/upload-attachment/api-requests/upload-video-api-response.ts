import { IUploadBaseResponse } from './base-upload-api-response';

export interface IUploadVideoApiResponse extends IUploadBaseResponse {
  previewUrl: string;
}
