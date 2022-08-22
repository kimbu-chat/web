import { AxiosResponse } from 'axios';
import { IGetGroupChatMembersRequest, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { userArrNormalizationSchema } from '@store/friends/normalization';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';
import {
  getInfoChatIdSelector,
  // getMembersCountForSelectedGroupChatSelector,
} from '../../selectors';

// import { GetGroupChatUsersSuccess } from './get-group-chat-users-success';

export interface IGetGroupChatUsersActionPayload {
  // isFromSearch: boolean;
  name?: string;
  offset: number;
  initializedByScroll: boolean;
}

export class GetGroupChatUsers {
  static get action() {
    return createDeferredAction<IGetGroupChatUsersActionPayload>('GET_GROUP_CHAT_USERS');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      const chat = draft.chats[draft?.selectedChatId || -1];

      if (chat) {
        chat.members.loading = true;
      }

      return draft;
    };
  }

  static get saga() {
    return function* getGroupChatUsersSaga(
      action: ReturnType<typeof GetGroupChatUsers.action>,
    ): SagaIterator {
      const { name, offset, initializedByScroll } = action.payload;

      const chatId = yield select(getInfoChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      if (groupChatId) {
        // const membersOffset = yield select(getMembersCountForSelectedGroupChatSelector);

        const request: IGetGroupChatMembersRequest = {
          name,
          groupChatId,
          page: { limit: CHAT_MEMBERS_LIMIT, offset: initializedByScroll ? offset : 0 },
        };

        try {
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

          action.meta?.deferred.resolve(result);

          yield put(AddOrUpdateUsers.action({ users }));
        } catch (e) {
          action.meta?.deferred.reject(e);
        }
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
