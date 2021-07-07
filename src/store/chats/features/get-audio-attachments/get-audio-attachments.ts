import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { IAudioAttachment } from '../../models';
import { getChatByIdDraftSelector, getInfoChatIdSelector } from '../../selectors';

import { IGetAudioAttachmentsActionPayload } from './action-payloads/get-audio-attachments-action-payload';
import { IGetAudioAttachmentsApiRequest } from './api-requests/get-audio-attachments-api-request';
import { GetAudioAttachmentsSuccess } from './get-audio-attachments-success';

export class GetAudioAttachments {
  static get action() {
    return createAction('GET_AUDIO_ATTACHMENTS')<IGetAudioAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.audios.loading = true;
        }
      }

      return draft;
    });
  }

  static get saga() {
    return function* getAudioAttachments(
      action: ReturnType<typeof GetAudioAttachments.action>,
    ): SagaIterator {
      const { page } = action.payload;

      const chatId = yield select(getInfoChatIdSelector);

      const { data, status } = GetAudioAttachments.httpRequest.call(
        yield call(() => GetAudioAttachments.httpRequest.generator({ page, chatId })),
      );

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetAudioAttachmentsSuccess.action({ audios: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IAudioAttachment[]>, IGetAudioAttachmentsApiRequest>(
      MAIN_API.GET_AUDIO_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
