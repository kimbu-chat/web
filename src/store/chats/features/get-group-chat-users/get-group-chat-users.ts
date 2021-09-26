import { AxiosResponse } from 'axios';
import { produce } from 'immer';
import { IGetGroupChatMembersRequest, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { userArrNormalizationSchema } from '@store/friends/normalization';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import {
  getInfoChatIdSelector,
  getMembersCountForSelectedGroupChatSelector,
} from '../../selectors';

import { IGetGroupChatUsersActionPayload } from './action-payloads/get-group-chat-users-action-payload';
import { GetGroupChatUsersSuccess } from './get-group-chat-users-success';

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
      const { isFromSearch, name } = action.payload;

      const chatId = yield select(getInfoChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      if (groupChatId) {
        const membersOffset = yield select(getMembersCountForSelectedGroupChatSelector);

        const request: IGetGroupChatMembersRequest = {
          name,
          groupChatId,
          page: { limit: CHAT_MEMBERS_LIMIT, offset: membersOffset },
        };

        const { data } = GetGroupChatUsers.httpRequest.call(
          yield call(() => GetGroupChatUsers.httpRequest.generator(request)),
        );

        const {
          entities: { users },
          result,
        } = normalize<IUser[], { users: Record<number, IUser> }, number[]>(
          data,
          userArrNormalizationSchema,
        );

        yield put(
          GetGroupChatUsersSuccess.action({
            userIds: result,
            chatId,
            isFromSearch,
            hasMore: data.length >= CHAT_MEMBERS_LIMIT,
          }),
        );

        yield put(AddOrUpdateUsers.action({ users }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>, IGetGroupChatMembersRequest>(
      MAIN_API.GET_GROUP_CHAT_USERS,
      HttpRequestMethod.Post,
    );
  }
}
