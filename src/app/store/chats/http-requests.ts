import { AxiosResponse } from 'axios';
import { HttpRequestMethod } from '../common/http-factory';
import { UploadAudioResponse, UploadFileResponse, UploadPictureResponse, UploadVideoResponse, UploadVoiceResponse } from './models';
import { ApiBasePath } from '../root-api';
import { httpFilesRequestFactory } from '../common/http-file-factory';

export const ChatHttpFileRequest = {
  uploadAudioAttachment: httpFilesRequestFactory<AxiosResponse<UploadAudioResponse>, FormData>(
    `${ApiBasePath.FilesAPI}/api/audio-attachments`,
    HttpRequestMethod.Post,
  ),
  uploadPictureAttachment: httpFilesRequestFactory<AxiosResponse<UploadPictureResponse>, FormData>(
    `${ApiBasePath.FilesAPI}/api/picture-attachments`,
    HttpRequestMethod.Post,
  ),
  uploadFileAttachment: httpFilesRequestFactory<AxiosResponse<UploadFileResponse>, FormData>(
    `${ApiBasePath.FilesAPI}/api/raw-attachments`,
    HttpRequestMethod.Post,
  ),
  uploadVideoAttachment: httpFilesRequestFactory<AxiosResponse<UploadVideoResponse>, FormData>(
    `${ApiBasePath.FilesAPI}/api/video-attachments`,
    HttpRequestMethod.Post,
  ),
  uploadVoiceAttachment: httpFilesRequestFactory<AxiosResponse<UploadVoiceResponse>, FormData>(
    `${ApiBasePath.FilesAPI}/api/voice-attachments`,
    HttpRequestMethod.Post,
  ),
};
