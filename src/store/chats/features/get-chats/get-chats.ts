import { IUser, IPage } from '@store/common/models';
import { IChat, INormalizedChat } from '@store/chats/models';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { normalize } from 'normalizr';

import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { ById } from '@store/chats/models/by-id';
import { CHATS_LIMIT } from '../../../../utils/pagination-limits';
import { chatArrNormalizationSchema } from '../../normalization';
import { IGetChatsActionPayload } from './action-payloads/get-chats-action-payload';
import { GetChatsSuccess } from './get-chats-success';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';
import { IGetChatsApiRequest } from './api-requests/get-chats-api-request';
import { getChatsPageSelector, getChatsSearchPageSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';
import { modelChatList } from '../../utils/model-chat-list';

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

      const page: IPage = {
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
      } = normalize<IChat[], { chats: ById<INormalizedChat>; users: ById<IUser> }, number[]>(
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
    return httpRequestFactory<AxiosResponse<IChat[]>, IGetChatsApiRequest>(
      MAIN_API.GET_CHATS,
      HttpRequestMethod.Post,
    );
  }
}
