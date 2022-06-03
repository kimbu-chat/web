import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IPaginationParams, IChat, IUser, IGetChatsRequest } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedChat } from '@store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { CHATS_LIMIT } from '@utils/pagination-limits';

import { IChatsState } from '../../chats-state';
import { chatArrNormalizationSchema } from '../../normalization';
import { getChatsPageSelector, getChatsSearchPageSelector } from '../../selectors';

import { GetChatsSuccess, IGetChatsSuccessActionPayload } from './get-chats-success';

export interface IGetChatsActionPayload {
  showOnlyHidden: boolean;
  showAll: boolean;
  initializedByScroll: boolean;
  name?: string;
}


export class GetChats {
  static get action() {
    return createAction<IGetChatsActionPayload>('GET_CHATS');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof GetChats.action>) => {
      if (!payload.name?.length && !payload.initializedByScroll) {
        draft.searchChatList.chatIds = [];
        draft.searchChatList.hasMore = true;
        draft.searchChatList.loading = false;
      }

      if (payload.name?.length) {
        draft.searchChatList.loading = true;
        if (payload.initializedByScroll) {
          draft.searchChatList.page += 1;
        } else {
          draft.searchChatList.page = 0;
        }
      } else if (payload.initializedByScroll) {
        draft.chatList.loading = true;
        draft.chatList.page += 1;
      }

      return draft;
    };
  }

  static get saga() {
    return function* getChats(action: ReturnType<typeof GetChats.action>): SagaIterator {
      const { name, showOnlyHidden, showAll, initializedByScroll } = action.payload;

      if (!name?.length && !initializedByScroll) {
        return;
      }

      const pageNumber = yield select(getChatsPageSelector);
      const searchPageNumber = yield select(getChatsSearchPageSelector);

      const page: IPaginationParams = {
        offset: (action.payload.name?.length ? searchPageNumber : pageNumber) * CHATS_LIMIT,
        limit: CHATS_LIMIT,
      };

      const request = {
        name,
        showOnlyHidden,
        page,
        showAll,
      };

      const { data }: AxiosResponse<IChat[]> = GetChats.httpRequest.call(
        yield call(() => GetChats.httpRequest.generator(request)),
      );

      const {
        entities: { chats: normalizedChats, users },
        result,
      } = normalize<
        IChat[],
        {
          chats?: Record<number, INormalizedChat>;
          users: Record<number, IUser>;
        },
        number[]
      >(data, chatArrNormalizationSchema);

      const chatList: IGetChatsSuccessActionPayload = {
        chats: normalizedChats || {},
        chatIds: result,
        hasMore: result.length >= CHATS_LIMIT,
        initializedByScroll,
        searchString: name,
      };

      yield put(GetChatsSuccess.action(chatList));

      yield put(AddOrUpdateUsers.action({ users }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IChat[]>, IGetChatsRequest>(
      MAIN_API.GET_CHATS,
      HttpRequestMethod.Post,
    );
  }
}
