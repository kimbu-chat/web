import { CHATS_LIMIT } from 'app/utils/pagination-limits';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IPage } from 'app/store/models';
import { ChatId } from '../../chat-id';
import { IChat, IChatsState, InterlocutorType, MessageState } from '../../models';
import { IGetChatsActionPayload } from './action-payloads/get-chats-action-payload';
import { GetChatsSuccess } from './get-chats-success';
import { IGetChatsSuccessActionPayload } from './action-payloads/get-chats-success-action-payload';
import { IGetChatsApiRequest } from './api-requests/get-chats-api-request';
import { getChatsPageSelector } from '../../selectors';

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
    return function* (action: ReturnType<typeof GetChats.action>): SagaIterator {
      const chatsRequestData = action.payload;

      const { name, showOnlyHidden, showAll, initializedByScroll } = action.payload;

      if ((name?.length || 0) === 0 && !initializedByScroll) {
        console.log('returned');
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

      const { data }: AxiosResponse<IChat[]> = GetChats.httpRequest.call(yield call(() => GetChats.httpRequest.generator(request)));
      data.forEach((chat: IChat) => {
        if (chat.lastMessage) {
          chat.lastMessage.state =
            chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= Number(chat?.lastMessage?.id)
              ? (MessageState.READ as MessageState)
              : (MessageState.SENT as MessageState);
        }

        chat.interlocutorType = ChatId.fromId(chat.id).interlocutorType;
        chat.typingInterlocutors = [];
        chat.photos = { photos: [], loading: false, hasMore: true };
        chat.videos = { videos: [], loading: false, hasMore: true };
        chat.files = { files: [], loading: false, hasMore: true };
        chat.audios = { audios: [], loading: false, hasMore: true };
        chat.draftMessage = '';
        chat.recordings = {
          hasMore: true,
          loading: false,
          recordings: [],
        };
        chat.messages = { messages: [], loading: false, hasMore: true };

        if (chat.interlocutorType === InterlocutorType.GroupChat) {
          chat.members = { members: [], loading: false, hasMore: true };
        }
      });

      const chatList: IGetChatsSuccessActionPayload = {
        chats: data,
        hasMore: data.length >= CHATS_LIMIT,
        initializedByScroll: chatsRequestData.initializedByScroll,
      };

      yield put(GetChatsSuccess.action(chatList));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IChat[]>, IGetChatsApiRequest>(`${process.env.MAIN_API}/api/chats/search`, HttpRequestMethod.Post);
  }
}
