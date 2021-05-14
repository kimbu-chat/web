import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getInfoChatIdSelector } from '../../selectors';
import { IVoiceAttachment } from '../../models';
import { IChatsState } from '../../chats-state';

import { IGetVoiceAttachmentsActionPayload } from './action-payloads/get-voice-attachments-action-payload';
import { GetVoiceAttachmentsSuccess } from './get-voice-attachments-success';
import { IGetVoiceAttachmentsApiRequest } from './api-requests/get-voice-attachments-api-request';

export class GetVoiceAttachments {
  static get action() {
    return createAction('GET_VOICE_ATTACHMENTS')<IGetVoiceAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat =
        draft.chats[draft.chatInfo.chatId || -1] || draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.recordings.loading = true;
      }
      return draft;
    });
  }

  static get saga() {
    return function* getVoiceAttachmentsSaga(
      action: ReturnType<typeof GetVoiceAttachments.action>,
    ): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getInfoChatIdSelector);

      const { data, status } = GetVoiceAttachments.httpRequest.call(
        yield call(() => GetVoiceAttachments.httpRequest.generator({ page, chatId })),
      );

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetVoiceAttachmentsSuccess.action({ recordings: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IVoiceAttachment[]>, IGetVoiceAttachmentsApiRequest>(
      MAIN_API.GET_VOICE_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
