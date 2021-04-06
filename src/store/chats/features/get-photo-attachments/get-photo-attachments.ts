import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from '../../selectors';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IPictureAttachment } from '../../models';
import { IGetPhotoAttachmentsActionPayload } from './action-payloads/get-photo-attachments-action-payload';
import { GetPhotoAttachmentsSuccess } from './get-photo-attachments-success';
import { IGetPhotoAttachmentsApiRequest } from './api-requests/get-photo-attachments-api-request';
import { IChatsState } from '../../chats-state';

export class GetPhotoAttachments {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS')<IGetPhotoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.photos.loading = true;
        }
      }
      return draft;
    });
  }

  static get saga() {
    return function* getPhotoAttachments(
      action: ReturnType<typeof GetPhotoAttachments.action>,
    ): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const { data, status } = GetPhotoAttachments.httpRequest.call(
        yield call(() => GetPhotoAttachments.httpRequest.generator({ page, chatId })),
      );

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetPhotoAttachmentsSuccess.action({ photos: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IPictureAttachment[]>, IGetPhotoAttachmentsApiRequest>(
      MAIN_API.GET_PHOTO_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
