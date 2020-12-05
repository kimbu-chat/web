import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { GetRawAttachmentsRequest, RawAttachment, GetChatFilesHTTPRequest } from '../../models';
import { GetRawAttachmentsSuccess } from './get-raw-attachments-success';

export class GetRawAttachments {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS')<GetRawAttachmentsRequest>();
  }

  static get saga() {
    return function* getRawAttachmentsSaga(action: ReturnType<typeof GetRawAttachments.action>): SagaIterator {
      const { chatId, page } = action.payload;

      const { data, status } = GetRawAttachments.httpRequest.call(yield call(() => GetRawAttachments.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetRawAttachmentsSuccess.action({ files: data, hasMore, chatId }));
      } else {
        alert('getRawAttachmentsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<RawAttachment>>, GetChatFilesHTTPRequest>(
      `${ApiBasePath.MainApi}/api/raw-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
