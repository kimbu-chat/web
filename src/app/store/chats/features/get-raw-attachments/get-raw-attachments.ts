import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { IRawAttachment } from '../../models';
import { IGetRawAttachmentsActionPayload } from './action-payloads/get-raw-attachments-action-payload';
import { GetRawAttachmentsSuccess } from './get-raw-attachments-success';
import { IGetRawAttachmentsApiRequest } from './api-requests/get-raw-attachments-api-request';
import { IChatsState } from '../../chats-state';

export class GetRawAttachments {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS')<IGetRawAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.files.loading = true;
        }
      }

      return draft;
    });
  }

  static get saga() {
    return function* getRawAttachmentsSaga(action: ReturnType<typeof GetRawAttachments.action>): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const { data, status } = GetRawAttachments.httpRequest.call(yield call(() => GetRawAttachments.httpRequest.generator({ page, chatId })));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetRawAttachmentsSuccess.action({ files: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IRawAttachment[]>, IGetRawAttachmentsApiRequest>(
      `${process.env.MAIN_API}/api/raw-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
