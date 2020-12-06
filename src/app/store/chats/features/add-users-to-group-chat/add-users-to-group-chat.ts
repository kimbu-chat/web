import { HTTPStatusCode } from 'app/common/http-status-code';
import { Meta } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { AddUsersToGroupChatActionData } from '../../models';
import { AddUsersToGroupChatSuccess } from './add-users-to-group-chat-success';

export class AddUsersToGroupChat {
  static get action() {
    return createAction('ADD_USERS_TO_GROUP_CHAT')<AddUsersToGroupChatActionData, Meta>();
  }

  static get saga() {
    return function* addUsersToGroupChatSaga(action: ReturnType<typeof AddUsersToGroupChat.action>): SagaIterator {
      try {
        const { chat, users } = action.payload;
        const userIds = users.map(({ id }) => id);

        const { status } = AddUsersToGroupChat.httpRequest.call(
          yield call(() =>
            AddUsersToGroupChat.httpRequest.generator({
              id: chat.groupChat!.id,
              userIds,
            }),
          ),
        );

        if (status === HTTPStatusCode.OK) {
          yield put(AddUsersToGroupChatSuccess.action({ chat, users }));

          action.meta.deferred?.resolve(action.payload.chat);
        } else {
          console.warn('Failed to add users to groupChat');
        }
      } catch {
        alert('addUsersToGroupChatSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, { id: number; userIds: number[] }>(`${ApiBasePath.MainApi}/api/group-chats/users`, HttpRequestMethod.Post);
  }
}
