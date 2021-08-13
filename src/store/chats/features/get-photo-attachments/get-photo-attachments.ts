import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IGetPictureAttachmentsRequest, IPictureAttachment } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createEmptyAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { PHOTO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getInfoChatIdSelector, getSelectedChatPhotosLengthSelector } from '../../selectors';

import { GetPhotoAttachmentsSuccess } from './get-photo-attachments-success';

export class GetPhotoAttachments {
  static get action() {
    return createEmptyAction('GET_PHOTO_ATTACHMENTS');
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
    return function* getPhotoAttachments(): SagaIterator {
      const chatId = yield select(getInfoChatIdSelector);
      const photoOffset = yield select(getSelectedChatPhotosLengthSelector);

      const { data, status } = GetPhotoAttachments.httpRequest.call(
        yield call(() =>
          GetPhotoAttachments.httpRequest.generator({
            page: { offset: photoOffset, limit: PHOTO_ATTACHMENTS_LIMIT },
            chatId,
          }),
        ),
      );

      const hasMore = data.length >= PHOTO_ATTACHMENTS_LIMIT;

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
