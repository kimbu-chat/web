import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatListChatIndex } from 'app/store/chats/selectors';
import { IAudioAttachment, IChatsState, IGetChatAudiosHTTPRequest } from '../../models';
import { IGetAudioAttachmentsActionPayload } from './get-audio-attachments-action-payload';
import { GetAudioAttachmentsSuccess } from './get-audio-attachments-success';

export class GetAudioAttachments {
  static get action() {
    return createAction('GET_AUDIO_ATTACHMENTS')<IGetAudioAttachmentsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetAudioAttachments.action>) => {
      const { chatId } = payload;

      const chatIndex: number = getChatListChatIndex(chatId, draft);

      if (chatIndex >= 0) {
        draft.chats[chatIndex].audios.loading = true;
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetAudioAttachments.action>): SagaIterator {
      const { chatId, page } = action.payload;

      const { data, status } = GetAudioAttachments.httpRequest.call(yield call(() => GetAudioAttachments.httpRequest.generator(action.payload)));

      const hasMore = data.length >= page.limit;

      if (status === HTTPStatusCode.OK) {
        yield put(GetAudioAttachmentsSuccess.action({ audios: data, hasMore, chatId }));
      } else {
        alert('getRecordingsSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IAudioAttachment[]>, IGetChatAudiosHTTPRequest>(
      `${process.env.MAIN_API}/api/audio-attachments/search`,
      HttpRequestMethod.Post,
    );
  }
}
