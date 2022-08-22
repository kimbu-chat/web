import { AxiosResponse } from 'axios';
import { IGetAllowedUsersForGroupChatRequest, IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

export interface IPossibleChatMembersActionPayload {
  groupChatId: number;
  offset: number;
  name?: string;
  initializedByScroll: boolean;
}

export class GetPossibleMembers {
  static get action() {
    return createDeferredAction<IPossibleChatMembersActionPayload>('GET_POSSIBLE_CHAT_MEMBERS');
  }

  static get saga() {
    return function* getGroupChatUsersSaga(
      action: ReturnType<typeof GetPossibleMembers.action>,
    ): SagaIterator {
      try {
        const { groupChatId, name, offset, initializedByScroll } = action.payload;

        const request: IGetAllowedUsersForGroupChatRequest = {
          name,
          groupChatId,
          page: { limit: CHAT_MEMBERS_LIMIT, offset: initializedByScroll ? offset : 0 },
        };

        const { data } = GetPossibleMembers.httpRequest.call(
          yield call(() => GetPossibleMembers.httpRequest.generator(request)),
        );

        action.meta?.deferred?.resolve(data);
      } catch (e: any) {
        action.meta?.deferred?.reject(e);
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IUser[]>, IGetAllowedUsersForGroupChatRequest>(
      MAIN_API.GROUP_CHAT_ALLOWED_MEMBERS,
      HttpRequestMethod.Post,
    );
  }
}
