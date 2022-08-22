import { AxiosResponse } from 'axios';
import { IGetGroupChatMembersRequest, IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import { ChatId } from '../../chat-id';
import { getInfoChatIdSelector } from '../../selectors';

export interface IGetGroupChatUsersActionPayload {
  name?: string;
  offset: number;
  initializedByScroll: boolean;
}

export class GetGroupChatUsers {
  static get action() {
    return createDeferredAction<IGetGroupChatUsersActionPayload>('GET_GROUP_CHAT_USERS');
  }

  static get saga() {
    return function* getGroupChatUsersSaga(
      action: ReturnType<typeof GetGroupChatUsers.action>,
    ): SagaIterator {
      const { name, offset, initializedByScroll } = action.payload;

      const chatId = yield select(getInfoChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      if (groupChatId) {
        const request: IGetGroupChatMembersRequest = {
          name,
          groupChatId,
          page: { limit: CHAT_MEMBERS_LIMIT, offset: initializedByScroll ? offset : 0 },
        };

        try {
          const { data } = GetGroupChatUsers.httpRequest.call(
            yield call(() => GetGroupChatUsers.httpRequest.generator(request)),
          );

          action.meta?.deferred.resolve(data);
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
