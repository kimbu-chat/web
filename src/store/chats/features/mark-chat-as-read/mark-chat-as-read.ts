import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IMarkChatAsReadRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedChat } from '@store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { getSelectedChatSelector } from '../../selectors';

import { MarkChatAsReadSuccess } from './mark-chat-as-read-success';

export class MarkChatAsRead {
  static get action() {
    return createAction('MARK_CHAT_AS_READ');
  }

  static get saga() {
    return function* markMessagesAsRead(): SagaIterator {
      const chat: INormalizedChat = yield select(getSelectedChatSelector);
      const chatId = chat?.id;
      const lastReadMessageId = chat?.lastMessageId;

      if (lastReadMessageId && chatId) {
        yield call(() => MarkChatAsRead.httpRequest.generator({ chatId, lastReadMessageId }));

        yield put(MarkChatAsReadSuccess.action({ chatId, lastReadMessageId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IMarkChatAsReadRequest>(
      MAIN_API.MARK_AS_READ,
      HttpRequestMethod.Post,
    );
  }
}
