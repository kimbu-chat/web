import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { GetVideoAttachmentsActionPayload } from './get-video-attachments-action-payload';
import { VideoAttachment, GetChatVideosHTTPRequest, ChatsState } from '../../models';
import { GetVideoAttachmentsSuccess } from './get-video-attachments-success';

export class GetVideoAttachments {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS')<GetVideoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetVideoAttachments.action>) => {
      const { chatId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].videos.loading = true;
      }
      return draft;
    });
  }

  static get saga() {
    return function* getVideoAttachmentsSaga(action: ReturnType<typeof GetVideoAttachments.action>): SagaIterator {
      const { chatId, page } = action.payload;

      const { data, status } = GetVideoAttachments.httpRequest.call(yield call(() => GetVideoAttachments.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetVideoAttachmentsSuccess.action({ videos: data, hasMore, chatId }));
      } else {
        alert('getVideoAttachmentsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<VideoAttachment>>, GetChatVideosHTTPRequest>(
      `${ApiBasePath.MainApi}/api/video-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
