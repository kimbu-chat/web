import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { IPage } from '../../../common/models';
import { CHATS_LIMIT } from '../../../../utils/pagination-limits';
import { IChat } from '../../models';
import { IGetChatsActionPayload } from './action-payloads/get-chats-action-payload';
import { GetChatsSuccess } from './get-chats-success';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';
import { IGetChatsApiRequest } from './api-requests/get-chats-api-request';
import { getChatsPageSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';
import { modelChatList } from '../../utils/model-chat-list';

export class GetChats {
  static get action() {
    return createAction('GET_CHATS')<IGetChatsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChats.action>) => {
      draft.searchString = payload.name || '';

      if ((payload.name?.length || 0) === 0 && !payload.initializedByScroll) {
        draft.hasMore = true;
      } else {
        draft.loading = true;
      }

      if (draft.searchString.length > 0) {
        if (payload.initializedByScroll) {
          draft.searchPage += 1;
        } else {
          draft.searchPage = 0;
        }
      } else if (payload.initializedByScroll) {
        draft.page += 1;
      }

      return draft;
    });
  }

  static get saga() {
    return function* getChats(action: ReturnType<typeof GetChats.action>): SagaIterator {
      const chatsRequestData = action.payload;

      const { name, showOnlyHidden, showAll, initializedByScroll } = action.payload;

      if ((name?.length || 0) === 0 && !initializedByScroll) {
        return;
      }

      const pageNumber = yield select(getChatsPageSelector);

      const page: IPage = {
        offset: pageNumber * CHATS_LIMIT,
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
      const newData = modelChatList(data);

      const chatList: IGetChatsSuccessActionPayload = {
        chats: newData,
        hasMore: newData.length >= CHATS_LIMIT,
        initializedByScroll: chatsRequestData.initializedByScroll,
      };

      yield put(GetChatsSuccess.action(chatList));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IChat[]>, IGetChatsApiRequest>(
      MAIN_API.GET_CHAts,
      HttpRequestMethod.Post,
    );
  }
}
