import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IGetVoiceAttachmentsActionPayload } from './get-voice-attachments-action-payload';
import { IVoiceAttachment, IGetVoiceAttachmentsHTTPRequest, IChatsState } from '../../models';
import { GetVoiceAttachmentsSuccess } from './get-voice-attachments-success';

export class GetVoiceAttachments {
  static get action() {
    return createAction('GET_VOICE_ATTACHMENTS')<IGetVoiceAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetVoiceAttachments.action>) => {
      const { chatId } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].recordings.loading = true;
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetVoiceAttachments.action>): SagaIterator {
      const { chatId, page } = action.payload;

      const { data, status } = GetVoiceAttachments.httpRequest.call(yield call(() => GetVoiceAttachments.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetVoiceAttachmentsSuccess.action({ recordings: data, hasMore, chatId }));
      } else {
        alert('getRecordingsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<IVoiceAttachment>>, IGetVoiceAttachmentsHTTPRequest>(
      `${process.env.MAIN_API}/api/voice-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
