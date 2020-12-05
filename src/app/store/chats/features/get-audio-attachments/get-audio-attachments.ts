import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { GetAudioAttachmentsRequest, AudioAttachment, GetChatAudiosHTTPRequest } from '../../models';
import { GetAudioAttachmentsSuccess } from './get-audio-attachments-success';

export class GetAudioAttachments {
  static get action() {
    return createAction('GET_AUDIO_ATTACHMENTS')<GetAudioAttachmentsRequest>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetAudioAttachments.action>): SagaIterator {
      const { chatId, page } = action.payload;

      const { data, status } = GetAudioAttachments.httpRequest.call(yield call(() => GetAudioAttachments.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetAudioAttachmentsSuccess.action({ audios: data, hasMore, chatId }));
      } else {
        alert('getRecordingsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<AudioAttachment>>, GetChatAudiosHTTPRequest>(
      `${ApiBasePath.MainApi}/api/audio-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
