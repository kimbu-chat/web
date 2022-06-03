import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IAttachmentBase, IGetRawAttachmentsRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { FILE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getInfoChatIdSelector, getSelectedChatFilesLengthSelector } from '../../selectors';

import { GetRawAttachmentsSuccess } from './get-raw-attachments-success';

export class GetRawAttachments {
  static get action() {
    return createAction('GET_RAW_ATTACHMENTS');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      const chat =
        draft.chats[draft.chatInfo.chatId || -1] || draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.files.loading = true;
      }

      return draft;
    };
  }

  static get saga() {
    return function* getRawAttachmentsSaga(): SagaIterator {
      const chatId = yield select(getInfoChatIdSelector);
      const filesOffset = yield select(getSelectedChatFilesLengthSelector);

      const { data, status } = GetRawAttachments.httpRequest.call(
        yield call(() =>
          GetRawAttachments.httpRequest.generator({
            page: { offset: filesOffset, limit: FILE_ATTACHMENTS_LIMIT },
            chatId,
          }),
        ),
      );

      const hasMore = data.length >= FILE_ATTACHMENTS_LIMIT;

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
