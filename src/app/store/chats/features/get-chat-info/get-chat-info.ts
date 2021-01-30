import { HTTPStatusCode } from 'app/common/http-status-code';
import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { getSelectedChatIdSelector } from '../../selectors';
import { IGetChatInfoApiRequest } from './api-requests/get-chat-info-api-request';
import { IGetChatInfoApiResponse } from './api-requests/get-chat-info-api-response';
import { GetChatInfoSuccess } from './get-chat-info-success';

export class GetChatInfo {
  static get action() {
    return createEmptyAction('GET_CHAT_INFO');
  }

  static get saga() {
    return function* getChatInfoSaga(): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);

      const { data, status } = GetChatInfo.httpRequest.call(yield call(() => GetChatInfo.httpRequest.generator({ chatId })));

      if (status === HTTPStatusCode.OK) {
        yield put(GetChatInfoSuccess.action({ ...data, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IGetChatInfoApiResponse>, IGetChatInfoApiRequest>(
      ({ chatId }: IGetChatInfoApiRequest) => `${process.env.MAIN_API}/api/chats/${chatId}/info`,
      HttpRequestMethod.Get,
    );
  }
}
