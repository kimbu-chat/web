import { httpFilesRequestFactory, HttpRequestMethod, IFilesRequestGenerator } from 'app/store/common/http-file-factory';
import { FileType } from 'app/store/messages/models';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import {
  IChatsState,
  IAttachmentToSend,
  IBaseAttachment,
  IUploadAttachmentSagaProgressData,
  IUploadAudioResponse,
  IUploadFileResponse,
  IUploadPictureResponse,
  IUploadVideoResponse,
  IUploadVoiceResponse,
} from '../../models';
import { addUploadingAttachment, removeUploadingAttachment } from '../../upload-qeue';
import { UploadAttachmentFailure } from './upload-attachment-failure';
import { UploadAttachmentProgress } from './upload-attachment-progress';
import { IUploadAttachmentRequestActionPayload } from './upload-attachment-request-action-payload';
import { UploadAttachmentSuccess } from './upload-attachment-success';

export class UploadAttachmentRequest {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_REQUEST')<IUploadAttachmentRequestActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentRequest.action>) => {
      const { type, chatId, attachmentId, file } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        if (!draft.chats[chatIndex].attachmentsToSend) {
          draft.chats[chatIndex].attachmentsToSend = [];
        }

        const attachmentToAdd: IAttachmentToSend<IBaseAttachment> = {
          attachment: {
            id: attachmentId,
            byteSize: file.size,
            creationDateTime: new Date(),
            url: '',
            type,
          },
          progress: 0,
          fileName: file.name,
          file,
        };

        draft.chats[chatIndex].attachmentsToSend?.push(attachmentToAdd);
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof UploadAttachmentRequest.action>): SagaIterator {
      const { file, type, chatId, attachmentId } = action.payload;
      let uploadRequest: IFilesRequestGenerator<AxiosResponse<any>, any>;

      switch (type) {
        case FileType.Audio:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadAudioAttachment;

          break;
        case FileType.Raw:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadFileAttachment;

          break;
        case FileType.Picture:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadPictureAttachment;

          break;
        case FileType.Voice:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadVoiceAttachment;

          break;
        case FileType.Video:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadVideoAttachment;

          break;
        default:
          break;
      }

      const data = new FormData();

      const uploadData = { file };

      Object.entries(uploadData).forEach((k) => {
        data.append(k[0], k[1]);
      });

      yield call(() =>
        uploadRequest.generator(data, {
          *onStart({ cancelTokenSource }): SagaIterator {
            addUploadingAttachment({ cancelTokenSource, id: attachmentId });
          },
          *onProgress(payload: IUploadAttachmentSagaProgressData): SagaIterator {
            yield put(UploadAttachmentProgress.action({ chatId, attachmentId, ...payload }));
          },
          *onSuccess(payload: IBaseAttachment): SagaIterator {
            removeUploadingAttachment(attachmentId);

            yield put(
              UploadAttachmentSuccess.action({
                chatId,
                attachmentId,
                attachment: payload,
              }),
            );
          },
          *onFailure(): SagaIterator {
            removeUploadingAttachment(attachmentId);
            yield put(UploadAttachmentFailure.action({ chatId, attachmentId }));
          },
        }),
      );
    };
  }

  static get httpRequest() {
    return {
      uploadAudioAttachment: httpFilesRequestFactory<AxiosResponse<IUploadAudioResponse>, FormData>(
        `${process.env.FILES_API}/api/audio-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadPictureAttachment: httpFilesRequestFactory<AxiosResponse<IUploadPictureResponse>, FormData>(
        `${process.env.FILES_API}/api/picture-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadFileAttachment: httpFilesRequestFactory<AxiosResponse<IUploadFileResponse>, FormData>(
        `${process.env.FILES_API}/api/raw-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadVideoAttachment: httpFilesRequestFactory<AxiosResponse<IUploadVideoResponse>, FormData>(
        `${process.env.FILES_API}/api/video-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadVoiceAttachment: httpFilesRequestFactory<AxiosResponse<IUploadVoiceResponse>, FormData>(
        `${process.env.FILES_API}/api/voice-attachments`,
        HttpRequestMethod.Post,
      ),
    };
  }
}
