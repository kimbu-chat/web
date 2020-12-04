import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { UserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { GetGroupChatUsersRequest } from '../models';
import { GetGroupChatUsersSuccess } from './get-group-chat-users-success';

export class GetGroupChatUsers {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS')<GetGroupChatUsersRequest>();
  }

  static get saga() {
    return function* getGroupChatUsersSaga(action: ReturnType<typeof GetGroupChatUsers.action>): SagaIterator {
      const { data } = GetGroupChatUsers.httpRequest.call(yield call(() => GetGroupChatUsers.httpRequest.generator(action.payload)));
      yield put(GetGroupChatUsersSuccess.action({ users: data }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<UserPreview>>, GetGroupChatUsersRequest>(
      `${ApiBasePath.MainApi}/api/group-chats/search-members`,
      HttpRequestMethod.Post,
    );
  }
}
