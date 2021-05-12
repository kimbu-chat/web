import { ById } from '@store/chats/models/by-id';
import { produce } from 'immer';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { userArrNormalizationSchema } from '@store/friends/normalization';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { normalize } from 'normalizr';
import { IUser } from '../../../common/models';
import { GetGroupChatUsersSuccess } from './get-group-chat-users-success';
import { ChatId } from '../../chat-id';
import { IGetGroupChatUsersActionPayload } from './action-payloads/get-group-chat-users-action-payload';
import { getInfoChatIdSelector } from '../../selectors';
import { IGetGroupChatUsersApiRequest } from './api-requests/get-group-chat-users-api-request';
import { IChatsState } from '../../chats-state';

export class GetGroupChatUsers {
  static get action() {
    return createAction('GET_GROUP_CHAT_USERS')<IGetGroupChatUsersActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      const chat = draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.members.loading = true;
      }

      return draft;
    });
  }

  static get saga() {
    return function* getGroupChatUsersSaga(
      action: ReturnType<typeof GetGroupChatUsers.action>,
    ): SagaIterator {
      const { isFromSearch, page, name } = action.payload;

      const chatId = yield select(getInfoChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      if (groupChatId) {
        const { data } = GetGroupChatUsers.httpRequest.call(
          yield call(() => GetGroupChatUsers.httpRequest.generator({ name, page, groupChatId })),
        );

        const {
          entities: { users },
          result,
        } = normalize<IUser[], { users: ById<IUser> }, number[]>(data, userArrNormalizationSchema);

        yield put(
          GetGroupChatUsersSuccess.action({
            userIds: result,
            chatId,
            isFromSearch,
            hasMore: data.length >= page.limit,
          }),
        );

        yield put(AddOrUpdateUsers.action({ users }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>, IGetGroupChatUsersApiRequest>(
      MAIN_API.GET_GROUP_CHAT_USERS,
      HttpRequestMethod.Post,
    );
  }
}
