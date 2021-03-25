import { IUploadBaseResponse } from './base-upload-api-response';

export interface IUploadPictureApiResponse extends IUploadBaseResponse {
  previewUrl: string;
}
