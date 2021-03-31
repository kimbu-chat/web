import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyAction } from '@store/common/actions';
import { HTTPStatusCode } from '../../../../common/http-status-code';
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

      const { data, status } = GetChatInfo.httpRequest.call(
        yield call(() => GetChatInfo.httpRequest.generator({ chatId })),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(GetChatInfoSuccess.action({ ...data, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IGetChatInfoApiResponse>, IGetChatInfoApiRequest>(
      ({ chatId }: IGetChatInfoApiRequest) =>
        `${process.env.REACT_APP_MAIN_API}/api/chats/${chatId}/info`,
      HttpRequestMethod.Get,
    );
  }
}
