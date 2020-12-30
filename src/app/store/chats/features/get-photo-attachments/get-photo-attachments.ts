import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { IPictureAttachment, IGetChatPicturesHTTPRequest, IChatsState } from '../../models';
import { IGetPhotoAttachmentsActionPayload } from './get-photo-attachments-action-payload';
import { GetPhotoAttachmentsSuccess } from './get-photo-attachments-success';

export class GetPhotoAttachments {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS')<IGetPhotoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetPhotoAttachments.action>) => {
      const { chatId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].photos.loading = true;
      }
      return draft;
    });
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
    return httpRequestFactory<AxiosResponse<IPictureAttachment[]>, IGetChatPicturesHTTPRequest>(
      `${ApiBasePath.MainApi}/api/picture-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
