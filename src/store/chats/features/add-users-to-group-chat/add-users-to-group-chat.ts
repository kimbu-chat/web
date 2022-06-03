import { AxiosResponse } from 'axios';
import { IAddUsersIntoGroupChatRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';

import { HTTPStatusCode } from '@common/http-status-code';
import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { ChatId } from '../../chat-id';
import { getSelectedChatIdSelector } from '../../selectors';

import { AddUsersToGroupChatSuccess } from './add-users-to-group-chat-success';

export interface IAddUsersToGroupChatActionPayload {
  userIds: number[];
}

export class AddUsersToGroupChat {
  static get action() {
    return createDeferredAction<IAddUsersToGroupChatActionPayload>('ADD_USERS_TO_GROUP_CHAT');
  }

  static get saga() {
    return function* addUsersToGroupChatSaga(
      action: ReturnType<typeof AddUsersToGroupChat.action>,
    ): SagaIterator {
      const { userIds } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      const { status } = AddUsersToGroupChat.httpRequest.call(
        yield call(
          () =>
            groupChatId &&
            AddUsersToGroupChat.httpRequest.generator({
              id: groupChatId,
              userIds,
            }),
        ),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(AddUsersToGroupChatSuccess.action({ chatId, userIds }));
        action.meta.deferred?.resolve();
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAddUsersIntoGroupChatRequest>(
      MAIN_API.ADD_TO_GROUP_CHAT,
      HttpRequestMethod.Post,
    );
  }
}
