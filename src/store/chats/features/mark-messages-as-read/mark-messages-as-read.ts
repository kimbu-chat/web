import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createEmptyAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { getSelectedChatSelector } from '../../selectors';

import { IMarkMessagesAsReadApiRequest } from './api-requests/mark-messages-as-read-api-request';
import { MarkMessagesAsReadSuccess } from './mark-messages-as-read-success';

export class MarkMessagesAsRead {
  static get action() {
    return createEmptyAction('RESET_UNREAD_MESSAGES_COUNT_FOR_SELECTED_CHAT');
  }

  static get saga() {
    return function* markMessagesAsRead(): SagaIterator {
      const chat = yield select(getSelectedChatSelector);
      const chatId = chat?.id;
      const lastReadMessageId = chat?.lastMessage?.id;

      if (lastReadMessageId && chatId) {
        yield call(() => MarkMessagesAsRead.httpRequest.generator({ chatId, lastReadMessageId }));

        yield put(MarkMessagesAsReadSuccess.action({ chatId, lastReadMessageId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IMarkMessagesAsReadApiRequest>(
      MAIN_API.MARK_AS_READ,
      HttpRequestMethod.Post,
    );
  }
}
