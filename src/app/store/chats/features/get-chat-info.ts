import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { GetChatInfoRequest, GetChatInfoApiResponse } from '../models';
import { GetChatInfoSuccess } from './get-chat-info-success';

export class GetChatInfo {
  static get action() {
    return createAction('GET_CHAT_INFO')<GetChatInfoRequest>();
  }

  static get saga() {
    return function* getChatInfoSaga(action: ReturnType<typeof GetChatInfo.action>): SagaIterator {
      const { data, status } = GetChatInfo.httpRequest.call(yield call(() => GetChatInfo.httpRequest.generator(action.payload)));

      if (status === HTTPStatusCode.OK) {
        yield put(GetChatInfoSuccess.action({ ...data, ...action.payload }));
      } else {
        alert('getChatInfoSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<GetChatInfoApiResponse>, GetChatInfoRequest>(
      ({ chatId }: GetChatInfoRequest) => `${ApiBasePath.MainApi}/api/chats/${chatId}/info`,
      HttpRequestMethod.Get,
    );
  }
}
