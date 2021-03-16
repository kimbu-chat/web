import { httpFilesRequestFactory, HttpRequestMethod, IFilesRequestGenerator } from 'app/store/common/http';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from 'app/store/chats/selectors';
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
import { IBaseAttachment } from '../../models/attachments/base-attachment';
import { IChatsState } from '../../chats-state';
import { FileType } from '../../models/file-type';

export class UploadAttachmentRequest {
  static get action() {
    return createAction('UPLOAD_ATTACHMENT_REQUEST')<IUploadAttachmentRequestActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentRequest.action>) => {
      const { type, attachmentId, file } = payload;

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
            },
            progress: 0,
            fileName: file.name,
            file,
          };

          chat.attachmentsToSend?.push(attachmentToAdd);
        }
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof UploadAttachmentRequest.action>): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);
      const { file, type, attachmentId } = action.payload;
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
          *onProgress({ progress, uploadedBytes }): SagaIterator {
            yield put(UploadAttachmentProgress.action({ chatId, attachmentId, progress, uploadedBytes }));
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
      uploadAudioAttachment: httpFilesRequestFactory<AxiosResponse<IUploadAudioApiResponse>, FormData>(
        `${process.env.FILES_API}/api/audio-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadPictureAttachment: httpFilesRequestFactory<AxiosResponse<IUploadPictureApiResponse>, FormData>(
        `${process.env.FILES_API}/api/picture-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadFileAttachment: httpFilesRequestFactory<AxiosResponse<IUploadFileApiResponse>, FormData>(
        `${process.env.FILES_API}/api/raw-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadVideoAttachment: httpFilesRequestFactory<AxiosResponse<IUploadVideoApiResponse>, FormData>(
        `${process.env.FILES_API}/api/video-attachments`,
        HttpRequestMethod.Post,
      ),
      uploadVoiceAttachment: httpFilesRequestFactory<AxiosResponse<IUploadVoiceApiResponse>, FormData>(
        `${process.env.FILES_API}/api/voice-attachments`,
        HttpRequestMethod.Post,
      ),
    };
  }
}
