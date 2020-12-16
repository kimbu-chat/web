import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatById, getHasMoreChats } from 'app/store/chats/selectors';
import { GetChatsSuccessActionPayload } from '../get-chats/get-chats-success-action-payload';
import { ChatsState, Chat, GetChatByIdRequestData } from '../../models';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { ChangeSelectedChatActionPayload } from './change-selected-chat-action-payload';

export class ChangeSelectedChat {
  static get action() {
    return createAction('CHANGE_SELECTED_CHAT')<ChangeSelectedChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof ChangeSelectedChat.action>) => {
      draft.chats.sort(
        ({ lastMessage: lastMessageA }, { lastMessage: lastMessageB }) =>
          new Date(lastMessageB?.creationDateTime!).getTime() - new Date(lastMessageA?.creationDateTime!).getTime(),
      );

      console.log(payload);

      draft.selectedChatId = payload.newChatId;

      return draft;
    });
  }

  static get saga() {
    return function* changeSelectedChatSaga(action: ReturnType<typeof ChangeSelectedChat.action>): SagaIterator {
      if (action.payload.newChatId !== null && !Number.isNaN(action.payload)) {
        const chatExists = (yield select(getChatById(action.payload.newChatId))) !== undefined;

        if (!chatExists) {
          const hasMore = yield select(getHasMoreChats);
          const { data, status } = ChangeSelectedChat.httpRequest.call(
            yield call(() => ChangeSelectedChat.httpRequest.generator({ chatId: action.payload.newChatId as number })),
          );

          if (status === HTTPStatusCode.OK) {
            const chatList: GetChatsSuccessActionPayload = {
              chats: [data],
              hasMore,
              initializedBySearch: false,
            };

            yield put(GetChatsSuccess.action(chatList));
          } else {
            alert('getChatInfoSaga error');
          }
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Chat>, GetChatByIdRequestData>(
      ({ chatId }: GetChatByIdRequestData) => `${ApiBasePath.MainApi}/api/chats/${chatId}`,
      HttpRequestMethod.Get,
    );
  }
}
