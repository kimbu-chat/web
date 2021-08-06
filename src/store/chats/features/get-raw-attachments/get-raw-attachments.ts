import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IAttachmentBase, IGetRawAttachmentsRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getInfoChatIdSelector } from '../../selectors';

import { IGetRawAttachmentsActionPayload } from './action-payloads/get-raw-attachments-action-payload';
import { GetRawAttachmentsSuccess } from './get-raw-attachments-success';

export class GetRawAttachments {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS')<IGetRawAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat =
        draft.chats[draft.chatInfo.chatId || -1] || draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.files.loading = true;
      }

      return draft;
    });
  }

  static get saga() {
    return function* getRawAttachmentsSaga(
      action: ReturnType<typeof GetRawAttachments.action>,
    ): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getInfoChatIdSelector);

      const { data, status } = GetRawAttachments.httpRequest.call(
        yield call(() => GetRawAttachments.httpRequest.generator({ page, chatId })),
      );

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetRawAttachmentsSuccess.action({ files: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IAttachmentBase[]>, IGetRawAttachmentsRequest>(
      MAIN_API.GET_RAW_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
