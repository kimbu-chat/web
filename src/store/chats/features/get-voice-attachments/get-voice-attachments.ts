import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IGetVoiceAttachmentsRequest, IVoiceAttachment } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { VOICE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getInfoChatIdSelector, getSelectedChatAudiosLengthSelector } from '../../selectors';

import { GetVoiceAttachmentsSuccess } from './get-voice-attachments-success';

export class GetVoiceAttachments {
  static get action() {
    return createAction('GET_VOICE_ATTACHMENTS');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      const chat =
        draft.chats[draft.chatInfo.chatId || -1] || draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.recordings.loading = true;
      }
      return draft;
    };
  }

  static get saga() {
    return function* getVoiceAttachmentsSaga(): SagaIterator {
      const chatId = yield select(getInfoChatIdSelector);
      const recordingsOffset = yield select(getSelectedChatAudiosLengthSelector);

      const { data, status } = GetVoiceAttachments.httpRequest.call(
        yield call(() =>
          GetVoiceAttachments.httpRequest.generator({
            page: { offset: recordingsOffset, limit: VOICE_ATTACHMENTS_LIMIT },
            chatId,
          }),
        ),
      );

      const hasMore = data.length >= VOICE_ATTACHMENTS_LIMIT;

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
