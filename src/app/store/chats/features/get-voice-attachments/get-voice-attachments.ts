import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { IGetVoiceAttachmentsActionPayload } from './action-payloads/get-voice-attachments-action-payload';
import { IVoiceAttachment, IChatsState } from '../../models';
import { GetVoiceAttachmentsSuccess } from './get-voice-attachments-success';
import { IGetVoiceAttachmentsApiRequest } from './api-requests/get-voice-attachments-api-request';

export class GetVoiceAttachments {
  static get action() {
    return createAction('GET_VOICE_ATTACHMENTS')<IGetVoiceAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

      if (chat) {
        chat.recordings.loading = true;
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetVoiceAttachments.action>): SagaIterator {
      const { page } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const { data, status } = GetVoiceAttachments.httpRequest.call(yield call(() => GetVoiceAttachments.httpRequest.generator({ page, chatId })));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetVoiceAttachmentsSuccess.action({ recordings: data, hasMore, chatId }));
      } else {
        alert('getRecordingsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IVoiceAttachment[]>, IGetVoiceAttachmentsApiRequest>(
      `${process.env.MAIN_API}/api/voice-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
