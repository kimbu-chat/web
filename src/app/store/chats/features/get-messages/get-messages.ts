import { getIsFirstChatsLoadSelector, getSelectedChatMessagesSearchStringSelector, getSelectedChatSelector } from 'store/chats/selectors';
import { IChatsState } from 'store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IMessage, MessageState } from '../../models';
import { IGetMessagesActionPayload } from './action-payloads/get-messages-action-payload';
import { IGetMessagesApiRequest } from './api-requests/get-messages-api-request';
import { GetMessagesSuccess } from './get-messages-success';
import { GetChatsSuccess } from '../get-chats/get-chats-success';

export class GetMessages {
  static get action() {
    return createAction('GET_MESSAGES')<IGetMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetMessages.action>) => {
      if (draft.selectedChatId) {
        draft.messages[draft.selectedChatId].loading = true;

        if (payload.isFromSearch) {
          draft.messages[draft.selectedChatId].searchString = payload.searchString;
        }
      }
      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetMessages.action>): SagaIterator {
      const { page, isFromSearch } = action.payload;

      const isFirstChatsLoad = yield select(getIsFirstChatsLoadSelector);

      if (isFirstChatsLoad) {
        console.log('isFirstChatsLoad');
        yield take(GetChatsSuccess.action);
        console.log('isFirstChatsLoad-end');
      } else {
        console.log('not-isFirstChatsLoad');
      }

      const chat = yield select(getSelectedChatSelector);

      const searchString = yield select(getSelectedChatMessagesSearchStringSelector);

      if (chat) {
        console.log(chat);
        const request: IGetMessagesApiRequest = {
          page,
          chatId: chat.id,
          searchString,
        };

        const { data } = GetMessages.httpRequest.call(yield call(() => GetMessages.httpRequest.generator(request)));

        data.forEach((message) => {
          message.state = chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= message.id ? MessageState.READ : MessageState.SENT;
        });

        const messageList = {
          chatId: chat.id,
          messages: data,
          hasMoreMessages: data.length >= page.limit,
          searchString,
          isFromSearch,
        };

        console.log(messageList);

        yield put(GetMessagesSuccess.action(messageList));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage[]>, IGetMessagesApiRequest>(`${process.env.MAIN_API}/api/messages/search`, HttpRequestMethod.Post);
  }
}