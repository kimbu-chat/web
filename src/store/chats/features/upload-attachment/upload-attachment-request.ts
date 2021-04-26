import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select, apply } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpFilesRequestFactory, HttpRequestMethod } from '@store/common/http';
import type { IFilesRequestGenerator } from '@store/common/http';
import { FILES_API } from '@common/paths';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from '../../selectors';
import { addUploadingAttachment, removeUploadingAttachment } from '../../upload-qeue';
import { UploadAttachmentFailure } from './upload-attachment-failure';
import { UploadAttachmentProgress } from './upload-attachment-progress';
import { IUploadAttachmentRequestActionPayload } from './action-payloads/upload-attachment-request-action-payload';
import { UploadAttachmentSuccess } from './upload-attachment-success';
import { IUploadAudioApiResponse } from './api-requests/upload-audio-api-response';
import { IUploadFileApiResponse } from './api-requests/upload-file-api-response';
import { IUploadPictureApiResponse } from './api-requests/upload-picture-api-response';
import { IUploadVideoApiResponse } from './api-requests/upload-video-api-response';
import { IUploadVoiceApiResponse } from './api-requests/upload-voice-api-response';
import { IAttachmentToSend } from '../../models/attachment-to-send';
import { IBaseAttachment } from '../../models/attachments';
import { IChatsState } from '../../chats-state';
import { FileType } from '../../models/file-type';

export class UploadAttachmentRequest {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_REQUEST')<IUploadAttachmentRequestActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentRequest.action>) => {
        const { type, attachmentId, file, waveFormJson } = payload;

        if (draft.selectedChatId) {
          const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

          if (chat) {
            if (!chat.attachmentsToSend) {
              chat.attachmentsToSend = [];
            }

            const attachmentToAdd: IAttachmentToSend<IBaseAttachment> = {
              attachment: {
                id: attachmentId,
                byteSize: file.size,
                creationDateTime: new Date(),
                url: '',
                type,
                fileName: file.name,
              },
              progress: 0,
              file,
              waveFormJson,
            };

            chat.attachmentsToSend?.push(attachmentToAdd);
          }
        }
        return draft;
      },
    );
  }

  static get saga() {
    return function* uploadAttachmentRequestSaga(
      action: ReturnType<typeof UploadAttachmentRequest.action>,
    ): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);
      const { file, type, attachmentId, waveFormJson } = action.payload;
      let uploadRequest: IFilesRequestGenerator<AxiosResponse, FormData>;

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

      const uploadData = { file, waveFormJson };

      Object.entries(uploadData).forEach((k) => {
        if (k[1]) {
          data.append(k[0], k[1]);
        }
      });

      yield call(() =>
        uploadRequest.generator(data, {
          *onStart({ cancelTokenSource }): SagaIterator {
            yield apply(addUploadingAttachment, addUploadingAttachment, [
              { cancelTokenSource, id: attachmentId },
            ]);
          },
          *onProgress({ progress, uploadedBytes }): SagaIterator {
            yield put(
              UploadAttachmentProgress.action({ chatId, attachmentId, progress, uploadedBytes }),
            );
          },
          *onSuccess(payload: AxiosResponse<IBaseAttachment>): SagaIterator {
            removeUploadingAttachment(attachmentId);
            yield put(
              UploadAttachmentSuccess.action({
                chatId,
                attachmentId,
                attachment: { ...payload.data, waveFormJson },
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
      uploadAudioAttachment: httpFilesRequestFactory<
        AxiosResponse<IUploadAudioApiResponse>,
        FormData
      >(FILES_API.UPLOAD_AUDIO_ATTACHMENTS, HttpRequestMethod.Post),
      uploadPictureAttachment: httpFilesRequestFactory<
        AxiosResponse<IUploadPictureApiResponse>,
        FormData
      >(FILES_API.UPLOAD_PICTURE_ATTACHMENTS, HttpRequestMethod.Post),
      uploadFileAttachment: httpFilesRequestFactory<
        AxiosResponse<IUploadFileApiResponse>,
        FormData
      >(FILES_API.UPLOAD_RAW_ATTACHMENTS, HttpRequestMethod.Post),
      uploadVideoAttachment: httpFilesRequestFactory<
        AxiosResponse<IUploadVideoApiResponse>,
        FormData
      >(FILES_API.UPLOAD_VIDEO_ATTACHMENTS, HttpRequestMethod.Post),
      uploadVoiceAttachment: httpFilesRequestFactory<
        AxiosResponse<IUploadVoiceApiResponse>,
        FormData
      >(FILES_API.UPLOAD_VOICE_ATTACHMENTS, HttpRequestMethod.Post),
    };
  }
}
