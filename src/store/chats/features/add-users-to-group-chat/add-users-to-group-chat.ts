import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector } from '../../selectors';
import { IAddUsersToGroupChatActionPayload } from './action-payloads/add-users-to-group-chat-action-payload';
import { AddUsersToGroupChatSuccess } from './add-users-to-group-chat-success';
import { IAddUsersToGroupChatApiRequest } from './api-requests/add-users-to-group-chat-api-request';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';

export class AddUsersToGroupChat {
  static get action() {
    return createAction('ADD_USERS_TO_GROUP_CHAT')<IAddUsersToGroupChatActionPayload>();
  }

  // TODO: handle loading
  static get reducer() {
    return produce((draft: IChatsState) => draft);
  }

  static get saga() {
    return function* addUsersToGroupChatSaga(action: ReturnType<typeof AddUsersToGroupChat.action>): SagaIterator {
      const { users } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      const userIds = users.map(({ id }) => id);

      const { status } = AddUsersToGroupChat.httpRequest.call(
        yield call(
          () =>
            groupChatId
            && AddUsersToGroupChat.httpRequest.generator({
              id: groupChatId,
              userIds,
            }),
        ),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(AddUsersToGroupChatSuccess.action({ chatId, users }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IAddUsersToGroupChatApiRequest>(
      `${process.env.MAIN_API}/api/group-chats/users`,
      HttpRequestMethod.Post,
    );
  }
}