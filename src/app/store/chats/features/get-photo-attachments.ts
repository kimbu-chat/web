import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { GetPhotoAttachmentsRequest, PictureAttachment, GetChatPicturesHTTPRequest } from '../models';
import { GetPhotoAttachmentsSuccess } from './get-photo-attachments-success';

export class GetPhotoAttachments {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS')<GetPhotoAttachmentsRequest>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetPhotoAttachments.action>): SagaIterator {
      const { chatId, page } = action.payload;

      const { data, status } = GetPhotoAttachments.httpRequest.call(yield call(() => GetPhotoAttachments.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetPhotoAttachmentsSuccess.action({ photos: data, hasMore, chatId }));
      } else {
        alert('getPhotoAttachmentsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<PictureAttachment>>, GetChatPicturesHTTPRequest>(
      `${ApiBasePath.MainApi}/api/picture-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
