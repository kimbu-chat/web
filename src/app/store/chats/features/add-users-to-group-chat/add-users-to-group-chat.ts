import { getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IAddUsersToGroupChatActionPayload } from './add-users-to-group-chat-action-payload';
import { AddUsersToGroupChatSuccess } from './add-users-to-group-chat-success';

export class AddUsersToGroupChat {
  static get action() {
    return createAction('ADD_USERS_TO_GROUP_CHAT')<IAddUsersToGroupChatActionPayload>();
  }

  static get saga() {
    return function* addUsersToGroupChatSaga(action: ReturnType<typeof AddUsersToGroupChat.action>): SagaIterator {
      try {
        const { users } = action.payload;
        const chatId = yield select(getSelectedChatIdSelector);
        const userIds = users.map(({ id }) => id);

        const { status } = AddUsersToGroupChat.httpRequest.call(
          yield call(() =>
            AddUsersToGroupChat.httpRequest.generator({
              id: chatId,
              userIds,
            }),
          ),
        );

        if (status === HTTPStatusCode.OK) {
          yield put(AddUsersToGroupChatSuccess.action({ chatId, users }));
        } else {
          console.warn('Failed to add users to groupChat');
        }
      } catch {
        alert('addUsersToGroupChatSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, { id: number; userIds: number[] }>(`${process.env.MAIN_API}/api/group-chats/users`, HttpRequestMethod.Post);
  }
}
