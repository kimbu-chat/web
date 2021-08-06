import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IGetPictureAttachmentsRequest, IPictureAttachment } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getInfoChatIdSelector } from '../../selectors';

import { IGetPhotoAttachmentsActionPayload } from './action-payloads/get-photo-attachments-action-payload';
import { GetPhotoAttachmentsSuccess } from './get-photo-attachments-success';

export class GetPhotoAttachments {
  static get action() {
    return createAction('GET_PHOTO_ATTACHMENTS')<IGetPhotoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat =
        draft.chats[draft.chatInfo.chatId || -1] || draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.photos.loading = true;
      }

      return draft;
    });
  }

  static get saga() {
    return function* getPhotoAttachments(
      action: ReturnType<typeof GetPhotoAttachments.action>,
    ): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getInfoChatIdSelector);

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
    return httpRequestFactory<AxiosResponse<IPictureAttachment[]>, IGetPictureAttachmentsRequest>(
      MAIN_API.GET_PHOTO_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
