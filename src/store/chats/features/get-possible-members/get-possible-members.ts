import { AxiosResponse } from 'axios';
import { IGetAllowedUsersForGroupChatRequest, IUser } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import { IPossibleChatMembersActionPayload } from './action-payloads/get-possible-members-action-payload';

export class GetPossibleMembers {
  static get action() {
    return createAction('GET_POSSIBLE_CHAT_MEMBERS')<IPossibleChatMembersActionPayload, Meta>();
  }

  static get saga() {
    return function* getGroupChatUsersSaga(
      action: ReturnType<typeof GetPossibleMembers.action>,
    ): SagaIterator {
      try {
        const { groupChatId, name, offset } = action.payload;

        const request: IGetAllowedUsersForGroupChatRequest = {
          name,
          groupChatId,
          page: { limit: CHAT_MEMBERS_LIMIT, offset },
        };

        const { data } = GetPossibleMembers.httpRequest.call(
          yield call(() => GetPossibleMembers.httpRequest.generator(request)),
        );

        action.meta.deferred.resolve(data);
      } catch (e: any) {
        action.meta.deferred.reject(e);
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
