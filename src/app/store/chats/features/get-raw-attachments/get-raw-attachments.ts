import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatArrayIndex } from 'app/store/chats/selectors';
import { RawAttachment, GetChatFilesHTTPRequest, ChatsState } from '../../models';
import { GetRawAttachmentsActionPayload } from './get-raw-attachments-action-payload';
import { GetRawAttachmentsSuccess } from './get-raw-attachments-success';

export class GetRawAttachments {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS')<GetRawAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetRawAttachments.action>) => {
      const { chatId } = payload;

      const chatIndex: number = getChatArrayIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].files.loading = true;
      }
      return draft;
    });
  }

  static get saga() {
    return function* getRawAttachmentsSaga(action: ReturnType<typeof GetRawAttachments.action>): SagaIterator {
      const { chatId, page } = action.payload;

      const { data, status } = GetRawAttachments.httpRequest.call(yield call(() => GetRawAttachments.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetRawAttachmentsSuccess.action({ files: data, hasMore, chatId }));
      } else {
        alert('getRawAttachmentsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<RawAttachment>>, GetChatFilesHTTPRequest>(
      `${ApiBasePath.MainApi}/api/raw-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
