import { produce } from 'immer';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { IUser } from '../../../common/models';
import { GetGroupChatUsersSuccess } from './get-group-chat-users-success';
import { ChatId } from '../../chat-id';
import { IGetGroupChatUsersActionPayload } from './action-payloads/get-group-chat-users-action-payload';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from '../../selectors';
import { IGetGroupChatUsersApiRequest } from './api-requests/get-group-chat-users-api-request';
import { IChatsState } from '../../chats-state';

export class GetGroupChatUsers {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS')<IGetGroupChatUsersActionPayload>();
  }

  static get reducer() {
    return produce(
      produce((draft: IChatsState) => {
        if (draft.selectedChatId) {
          const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

          if (chat) {
            chat.members.loading = true;
          }
        }

        return draft;
      }),
    );
  }

  static get saga() {
    return function* getGroupChatUsersSaga(action: ReturnType<typeof GetGroupChatUsers.action>): SagaIterator {
      const { isFromSearch, page, name } = action.payload;

      const chatId = yield select(getSelectedChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      if (groupChatId) {
        const { data } = GetGroupChatUsers.httpRequest.call(yield call(() => GetGroupChatUsers.httpRequest.generator({ name, page, groupChatId })));

        yield put(
          GetGroupChatUsersSuccess.action({
            users: data,
            chatId,
            isFromSearch,
            hasMore: data.length >= page.limit,
          }),
        );
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>, IGetGroupChatUsersApiRequest>(
      `${process.env.MAIN_API}/api/group-chats/search-members`,
      HttpRequestMethod.Post,
    );
  }
}
