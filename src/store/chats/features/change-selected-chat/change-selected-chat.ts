import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';
import { MAIN_API } from '@common/paths';
import {
  getChatByIdSelector,
  getChatByIdDraftSelector,
  getIsFirstChatsLoadSelector,
} from '../../selectors';
import { IUser } from '../../../common/models';
import { MESSAGES_LIMIT } from '../../../../utils/pagination-limits';
import { IChat } from '../../models';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { IChangeSelectedChatActionPayload } from './action-payloads/change-selected-chat-action-payload';
import { IGetChatByIdApiRequest } from './api-requests/get-chat-by-id-api-request';
import { IGetUserByIdApiRequest } from './api-requests/get-user-by-id-api-request';
import { UnshiftChat } from '../unshift-chat/unshift-chat';
import { IChatsState } from '../../chats-state';
import { modelChatList } from '../../utils/model-chat-list';

export class ChangeSelectedChat {
  static get action() {
    return createAction('CHANGE_SELECTED_CHAT')<IChangeSelectedChatActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof ChangeSelectedChat.action>) => {
        const { newChatId } = payload;

        draft.isInfoOpened = false;

        const oldChatId = draft.selectedChatId;

        if (oldChatId) {
          const chat = getChatByIdDraftSelector(oldChatId, draft);

          if (chat && draft.messages[oldChatId]?.messages.length > MESSAGES_LIMIT) {
            draft.messages[oldChatId].messages = draft.messages[oldChatId].messages.slice(0, 30);
            draft.messages[oldChatId].hasMore = true;
          }

          if (chat && draft.selectedMessageIds.length > 0) {
            draft.messages[oldChatId].messages = draft.messages[oldChatId].messages.map(
              (message) => ({
                ...message,
                isSelected: false,
              }),
            );
          }
        }

        draft.selectedChatId = newChatId;

        draft.selectedMessageIds = [];

        return draft;
      },
    );
  }

  static get saga() {
    return function* changeSelectedChatSaga(
      action: ReturnType<typeof ChangeSelectedChat.action>,
    ): SagaIterator {
      if (action.payload.newChatId !== null && !Number.isNaN(action.payload.newChatId)) {
        const isFirstChatsLoad = yield select(getIsFirstChatsLoadSelector);

        if (isFirstChatsLoad) {
          yield take(GetChatsSuccess.action);
        }

        const chatExists =
          (yield select(getChatByIdSelector(action.payload.newChatId))) !== undefined;

        if (!chatExists) {
          const { data } = ChangeSelectedChat.httpRequest.getChat.call(
            yield call(() =>
              ChangeSelectedChat.httpRequest.getChat.generator({
                chatId: action.payload.newChatId as number,
              }),
            ),
          );

          const [modeledChat] = modelChatList([data]);
          yield put(UnshiftChat.action(modeledChat));
        }
      }
    };
  }

  static get httpRequest() {
    return {
      getChat: httpRequestFactory<AxiosResponse<IChat>, IGetChatByIdApiRequest>(
        ({ chatId }: IGetChatByIdApiRequest) => replaceInUrl(MAIN_API.GET_CHAT, ['chatId', chatId]),
        HttpRequestMethod.Get,
      ),
      getUser: httpRequestFactory<AxiosResponse<IUser>, IGetUserByIdApiRequest>(
        ({ userId }: IGetUserByIdApiRequest) => replaceInUrl(MAIN_API.GET_USER, ['userId', userId]),
        HttpRequestMethod.Get,
      ),
    };
  }
}
