import { produce } from 'immer';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { IUserPreview } from 'app/store/my-profile/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IChatsState } from '../../models';
import { GetGroupChatUsersSuccess } from './get-group-chat-users-success';
import { ChatId } from '../../chat-id';
import { IGetGroupChatUsersActionPayload } from './get-group-chat-users-action-payload';

export class GetGroupChatUsers {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS')<IGetGroupChatUsersActionPayload>();
  }

  static get reducer() {
    return produce(
      produce((draft: IChatsState) => {
        draft.groupChatUsersLoading = true;
        return draft;
      }),
    );
  }

  static get saga() {
    return function* getGroupChatUsersSaga(action: ReturnType<typeof GetGroupChatUsers.action>): SagaIterator {
      const { data } = GetGroupChatUsers.httpRequest.call(yield call(() => GetGroupChatUsers.httpRequest.generator(action.payload)));
      console.log(ChatId.from(undefined, action.payload.groupChatId).id);
      yield put(
        GetGroupChatUsersSuccess.action({
          users: data,
          chatId: ChatId.from(undefined, action.payload.groupChatId).id,
          isFromSearch: action.payload.isFromSearch,
          isFromScroll: action.payload.isFromScroll,
          hasMore: data.length >= action.payload.page.limit,
        }),
      );
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Array<IUserPreview>>, IGetGroupChatUsersActionPayload>(
      `${ApiBasePath.MainApi}/api/group-chats/search-members`,
      HttpRequestMethod.Post,
    );
  }
}
