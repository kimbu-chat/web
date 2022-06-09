import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IDeleteMessagesRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { cancelSendMessageRequest } from '@utils/cancel-send-message-request';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector } from '../../selectors';

import { DeleteMessageSuccess } from './delete-message-success';

export interface IDeleteMessageActionPayload {
  messageIds: number[];
  forEveryone: boolean;
}

export class DeleteMessage {
  static get action() {
    return createAction<IDeleteMessageActionPayload>('DELETE_MESSAGE');
  }

  static get saga() {
    return function* deleteMessageSaga(
      action: ReturnType<typeof DeleteMessage.action>,
    ): SagaIterator {
      const { messageIds, forEveryone } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      /* Not all messages that come in payload are already sent to the server, that's why we have to
      filter messages ids and to send to server only 'SENT' messages */
      const messageIdsToRemove: number[] = [];

      messageIds.forEach((id) => {
        if (!cancelSendMessageRequest(id)) {
          messageIdsToRemove.push(id);
        }
      });

      // if there is not messages to be sent to server, we will not send request to server and we will suppose that response status is "OK"
      let status = HTTPStatusCode.OK;

      if (!(messageIdsToRemove.length === 0)) {
        status = DeleteMessage.httpRequest.call(
          yield call(() =>
            DeleteMessage.httpRequest.generator({ ids: messageIdsToRemove, forEveryone, chatId }),
          ),
        ).status;
      }

      if (status === HTTPStatusCode.OK) {
        yield put(DeleteMessageSuccess.action({ messageIds, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IDeleteMessagesRequest>(
      MAIN_API.DELETE_MESSAGES,
      HttpRequestMethod.Post,
    );
  }
}
