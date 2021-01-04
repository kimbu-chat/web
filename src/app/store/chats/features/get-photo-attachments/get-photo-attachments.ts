import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { IPictureAttachment, IGetChatPicturesHTTPRequest, IChatsState } from '../../models';
import { IGetPhotoAttachmentsActionPayload } from './get-photo-attachments-action-payload';
import { GetPhotoAttachmentsSuccess } from './get-photo-attachments-success';

export class GetPhotoAttachments {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS')<IGetPhotoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

      if (chat) {
        chat.photos.loading = true;
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetPhotoAttachments.action>): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const { data, status } = GetPhotoAttachments.httpRequest.call(yield call(() => GetPhotoAttachments.httpRequest.generator({ page, chatId })));

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
      `${process.env.MAIN_API}/api/picture-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
