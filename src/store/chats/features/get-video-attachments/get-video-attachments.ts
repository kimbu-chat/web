import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from '../../selectors';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IGetVideoAttachmentsActionPayload } from './action-payloads/get-video-attachments-action-payload';
import { IVideoAttachment } from '../../models';
import { GetVideoAttachmentsSuccess } from './get-video-attachments-success';
import { IGetVideoAttachmentsApiRequest } from './api-requests/get-video-attachments-api-request';
import { IChatsState } from '../../chats-state';

export class GetVideoAttachments {
  static get action() {
    return createAction('GET_VIDEO_ATTACHMENTS')<IGetVideoAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.videos.loading = true;
        }
      }

      return draft;
    });
  }

  static get saga() {
    return function* getVideoAttachmentsSaga(action: ReturnType<typeof GetVideoAttachments.action>): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

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
      `${process.env.MAIN_API}/api/video-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
