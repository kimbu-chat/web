import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IGetVideoAttachmentsRequest, IVideoAttachment } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { VIDEO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getInfoChatIdSelector, getSelectedChatVideosLengthSelector } from '../../selectors';

import { GetVideoAttachmentsSuccess } from './get-video-attachments-success';

export class GetVideoAttachments {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      const chat =
        draft.chats[draft.chatInfo.chatId || -1] || draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.videos.loading = true;
      }

      return draft;
    };
  }

  static get saga() {
    return function* getVideoAttachmentsSaga(): SagaIterator {
      const chatId = yield select(getInfoChatIdSelector);
      const videoOffset = yield select(getSelectedChatVideosLengthSelector);

      const { data, status } = GetVideoAttachments.httpRequest.call(
        yield call(() =>
          GetVideoAttachments.httpRequest.generator({
            page: { offset: videoOffset, limit: VIDEO_ATTACHMENTS_LIMIT },
            chatId,
          }),
        ),
      );

      const hasMore = data.length >= VIDEO_ATTACHMENTS_LIMIT;

      if (status === HTTPStatusCode.OK) {
        yield put(GetVideoAttachmentsSuccess.action({ videos: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IVideoAttachment[]>, IGetVideoAttachmentsRequest>(
      MAIN_API.GET_VIDEO_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
