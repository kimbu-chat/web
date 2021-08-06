import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IGetVoiceAttachmentsRequest, IVoiceAttachment } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getInfoChatIdSelector } from '../../selectors';

import { IGetVoiceAttachmentsActionPayload } from './action-payloads/get-voice-attachments-action-payload';
import { GetVoiceAttachmentsSuccess } from './get-voice-attachments-success';

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
    return httpRequestFactory<AxiosResponse<IVoiceAttachment[]>, IGetVoiceAttachmentsRequest>(
      MAIN_API.GET_VOICE_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
