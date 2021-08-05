import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IPaginationParams, IChat, IUser, IGetChatsRequest } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { INormalizedChat } from '@store/chats/models';
import { ById } from '@store/chats/models/by-id';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';

import { CHATS_LIMIT } from '../../../../utils/pagination-limits';
import { IChatsState } from '../../chats-state';
import { chatArrNormalizationSchema } from '../../normalization';
import { getChatsPageSelector, getChatsSearchPageSelector } from '../../selectors';
import { modelChatList } from '../../utils/model-chat-list';

import { IGetChatsActionPayload } from './action-payloads/get-chats-action-payload';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';
import { GetChatsSuccess } from './get-chats-success';

export class GetChats {
  static get action() {
    return createAction('GET_CHATS')<IGetChatsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChats.action>) => {
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
    });
  }

  static get saga() {
    return function* getChats(action: ReturnType<typeof GetChats.action>): SagaIterator {
      const chatsRequestData = action.payload;

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
      } = normalize<IChat[], { chats?: ById<INormalizedChat>; users: ById<IUser> }, number[]>(
        data,
        chatArrNormalizationSchema,
      );

      const modeledChats = modelChatList(normalizedChats);

      const chatList: IGetChatsSuccessActionPayload = {
        chats: modeledChats,
        chatIds: result,
        hasMore: result.length >= CHATS_LIMIT,
        initializedByScroll: chatsRequestData.initializedByScroll,
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
