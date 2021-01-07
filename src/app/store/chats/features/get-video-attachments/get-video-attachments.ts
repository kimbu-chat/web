import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { IGetVideoAttachmentsActionPayload } from './action-payloads/get-video-attachments-action-payload';
import { IVideoAttachment, IChatsState } from '../../models';
import { GetVideoAttachmentsSuccess } from './get-video-attachments-success';
import { IGetVideoAttachmentsApiRequest } from './api-requests/get-video-attachments-api-request';

export class GetVideoAttachments {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS')<IGetVideoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

      if (chat) {
        chat.videos.loading = true;
      }

      return draft;
    });
  }

  static get saga() {
    return function* getVideoAttachmentsSaga(action: ReturnType<typeof GetVideoAttachments.action>): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const { data, status } = GetVideoAttachments.httpRequest.call(yield call(() => GetVideoAttachments.httpRequest.generator({ page, chatId })));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetVideoAttachmentsSuccess.action({ videos: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IVideoAttachment[]>, IGetVideoAttachmentsApiRequest>(
      `${process.env.MAIN_API}/api/video-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
