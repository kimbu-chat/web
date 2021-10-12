import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IAudioAttachment, IGetAudioAttachmentsRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createEmptyAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AUDIO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import {
  getChatByIdDraftSelector,
  getInfoChatIdSelector,
  getSelectedChatAudiosLengthSelector,
} from '../../selectors';

import { GetAudioAttachmentsSuccess } from './get-audio-attachments-success';

export class GetAudioAttachments {
  static get action() {
    return createEmptyAction('GET_AUDIO_ATTACHMENTS');
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
    return function* getAudioAttachments(): SagaIterator {
      const chatId = yield select(getInfoChatIdSelector);
      const audioOffset = yield select(getSelectedChatAudiosLengthSelector);

      const { data, status } = GetAudioAttachments.httpRequest.call(
        yield call(() =>
          GetAudioAttachments.httpRequest.generator({
            page: { limit: AUDIO_ATTACHMENTS_LIMIT, offset: audioOffset },
            chatId,
          }),
        ),
      );

      const hasMore = data.length >= AUDIO_ATTACHMENTS_LIMIT;

      if (status === HTTPStatusCode.OK) {
        yield put(GetAudioAttachmentsSuccess.action({ audios: data, hasMore, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IAudioAttachment[]>, IGetAudioAttachmentsRequest>(
      MAIN_API.GET_AUDIO_ATTACHMENTS,
      HttpRequestMethod.Post,
    );
  }
}
