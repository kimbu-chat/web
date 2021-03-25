import { IUploadBaseResponse } from './base-upload-api-response';

export interface IUploadVoiceApiResponse extends IUploadBaseResponse {
  duration: string;
}
