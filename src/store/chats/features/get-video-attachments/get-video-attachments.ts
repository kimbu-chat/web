import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';

import { getInfoChatIdSelector } from '../../selectors';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IVideoAttachment } from '../../models';
import { IChatsState } from '../../chats-state';

import { IGetVideoAttachmentsActionPayload } from './action-payloads/get-video-attachments-action-payload';
import { GetVideoAttachmentsSuccess } from './get-video-attachments-success';
import { IGetVideoAttachmentsApiRequest } from './api-requests/get-video-attachments-api-request';

export class GetVideoAttachments {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS')<IGetVideoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat =
        draft.chats[draft.chatInfo.chatId || -1] || draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.videos.loading = true;
      }

      return draft;
    });
  }

  static get saga() {
    return function* getVideoAttachmentsSaga(
      action: ReturnType<typeof GetVideoAttachments.action>,
    ): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getInfoChatIdSelector);

      const { data, status } = GetVideoAttachments.httpRequest.call(
        yield call(() => GetVideoAttachments.httpRequest.generator({ page, chatId })),
      );

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetVideoAttachmentsSuccess.action({ videos: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IVideoAttachment[]>, IGetVideoAttachmentsApiRequest>(
      MAIN_API.GET_VIDEO_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
