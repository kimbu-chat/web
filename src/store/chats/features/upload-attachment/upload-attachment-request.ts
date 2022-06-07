import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import {
  AttachmentType,
  IAttachmentBase,
  ICreateAudioAttachmentCommandResult,
  ICreatePictureAttachmentCommandResult,
  ICreateRawAttachmentCommandResult,
  ICreateVideoAttachmentCommandResult,
  ICreateVoiceAttachmentCommandResult,
} from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { apply, call, put, select } from 'redux-saga/effects';

import { MAX_FILE_SIZE_MB } from '@common/constants';
import { FILES_API } from '@common/paths';
import { IAttachmentToSend } from '@store/chats/models';
import { httpFilesRequestFactory, HttpRequestMethod } from '@store/common/http';
import { emitToast } from '@utils/emit-toast';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector, getChatByIdSelector } from '../../selectors';
import { addUploadingAttachment, removeUploadingAttachment } from '../../upload-qeue';

import { UploadAttachmentFailure } from './upload-attachment-failure';
import { UploadAttachmentProgress } from './upload-attachment-progress';
import { UploadAttachmentSuccess } from './upload-attachment-success';

import type { IFilesRequestGenerator } from '@store/common/http';

export interface IUploadAttachmentRequestActionPayload {
  chatId?: number;
  type: AttachmentType;
  attachmentId: number;
  file: File;
  waveFormJson?: string;
  noStateChange?: boolean;
}


export class UploadAttachmentRequest {
  static get action() {
    return createAction<IUploadAttachmentRequestActionPayload>('UPLOAD_ATTACHMENT_REQUEST');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof UploadAttachmentRequest.action>) => {
      const { type, attachmentId, file, waveFormJson, noStateChange } = payload;

      if (noStateChange) {
        return draft;
      }

      if (file.size / 1048576 > MAX_FILE_SIZE_MB) {
        return draft;
      }

      if (!draft.selectedChatId) {
        return draft;
      }

      const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

      if (!chat.draftMessageId) {
        return draft;
      }

      const draftMessage = chat.messages.messages[chat?.draftMessageId];

      if (chat) {
        if (!draftMessage.attachments) {
          draftMessage.attachments = [];
        }

        const attachmentToAdd: IAttachmentToSend = {
          id: attachmentId,
          byteSize: file.size,
          type,
          success: false,
          progress: 0,
          file,
          waveFormJson,
        };

        draftMessage.attachments.push(attachmentToAdd);
      }

      return draft;
    };
  }

  static get saga() {
    return function* uploadAttachmentRequestSaga(
      action: ReturnType<typeof UploadAttachmentRequest.action>,
    ): SagaIterator {
      const { file, type, attachmentId, waveFormJson, chatId } = action.payload;
      let uploadRequest: IFilesRequestGenerator<AxiosResponse, FormData>;

      if (file.size / 1048576 > MAX_FILE_SIZE_MB) {
        emitToast(`The file "${file.name}" size cannot exceed 25Mb`, { type: 'error' });

        return;
      }

      if (!chatId) {
        return;
      }

      const chat = yield select(getChatByIdSelector(chatId));

      if (!chat.draftMessageId) {
        return;
      }

      switch (type) {
        case AttachmentType.Audio:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadAudioAttachment;

          break;
        case AttachmentType.Raw:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadFileAttachment;

          break;
        case AttachmentType.Picture:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadPictureAttachment;

          break;
        case AttachmentType.Voice:
          uploadRequest = UploadAttachmentRequest.httpRequest.uploadVoiceAttachment;

          break;
        case AttachmentType.Video:
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
          * onStart({ cancelTokenSource }): SagaIterator {
            yield apply(addUploadingAttachment, addUploadingAttachment, [
              { cancelTokenSource, id: attachmentId },
            ]);
          },
          * onProgress({ progress, uploadedBytes }): SagaIterator {
            yield put(
              UploadAttachmentProgress.action({
                draftId: chat.draftMessageId,
                chatId,
                attachmentId,
                progress,
                uploadedBytes,
              }),
            );
          },
          * onSuccess(payload: AxiosResponse<IAttachmentBase>): SagaIterator {
            removeUploadingAttachment(attachmentId);
            yield put(
              UploadAttachmentSuccess.action({
                chatId,
                draftId: chat.draftMessageId,
                attachmentId,
                attachment: { ...payload.data, waveFormJson } as IAttachmentBase,
              }),
            );
          },
          * onFailure(): SagaIterator {
            removeUploadingAttachment(attachmentId);
            yield put(UploadAttachmentFailure.action({ chatId, attachmentId }));
          },
        }),
      );
    };
  }

  static get httpRequest() {
    return {
      uploadAudioAttachment: httpFilesRequestFactory<AxiosResponse<ICreateAudioAttachmentCommandResult>,
        FormData>(FILES_API.UPLOAD_AUDIO_ATTACHMENTS, HttpRequestMethod.Post),
      uploadPictureAttachment: httpFilesRequestFactory<AxiosResponse<ICreatePictureAttachmentCommandResult>,
        FormData>(FILES_API.UPLOAD_PICTURE_ATTACHMENTS, HttpRequestMethod.Post),
      uploadFileAttachment: httpFilesRequestFactory<AxiosResponse<ICreateRawAttachmentCommandResult>,
        FormData>(FILES_API.UPLOAD_RAW_ATTACHMENTS, HttpRequestMethod.Post),
      uploadVideoAttachment: httpFilesRequestFactory<AxiosResponse<ICreateVideoAttachmentCommandResult>,
        FormData>(FILES_API.UPLOAD_VIDEO_ATTACHMENTS, HttpRequestMethod.Post),
      uploadVoiceAttachment: httpFilesRequestFactory<AxiosResponse<ICreateVoiceAttachmentCommandResult>,
        FormData>(FILES_API.UPLOAD_VOICE_ATTACHMENTS, HttpRequestMethod.Post),
    };
  }
}
