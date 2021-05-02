import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { normalize } from 'normalizr';
import { UpdateUsersList } from '@store/users/features/update-users-list/update-users-list';
import { IUser } from '../../../common/models/user';
import { INormalizedMessage } from '../../models/message';
import { messageArrNormalizationSchema } from '../../normalization';
import { GetMessagesFailure } from './get-messages-failure';
import {
  getIsFirstChatsLoadSelector,
  getSelectedChatMessagesSearchStringSelector,
  getSelectedChatSelector,
} from '../../selectors';
import { IMessage, MessageState } from '../../models';
import { IGetMessagesActionPayload } from './action-payloads/get-messages-action-payload';
import { IGetMessagesApiRequest } from './api-requests/get-messages-api-request';
import { GetMessagesSuccess } from './get-messages-success';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { IChatsState } from '../../chats-state';

export class GetMessages {
  static get action() {
    return createAction('GET_MESSAGES')<IGetMessagesActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetMessages.action>) => {
      if (draft.selectedChatId) {
        const selectedChatMessages = draft.messages[draft.selectedChatId];

        if (selectedChatMessages) {
          selectedChatMessages.loading = true;

          if (payload.isFromSearch) {
            selectedChatMessages.searchString = payload.searchString;
          }
        }
      }
      return draft;
    });
  }

  static get saga() {
    return function* getMessages(action: ReturnType<typeof GetMessages.action>): SagaIterator {
      const { page, isFromSearch } = action.payload;

      const isFirstChatsLoad = yield select(getIsFirstChatsLoadSelector);

      if (isFirstChatsLoad) {
        yield take(GetChatsSuccess.action);
      }

      const chat = yield select(getSelectedChatSelector);

      const searchString = yield select(getSelectedChatMessagesSearchStringSelector);

      if (chat) {
        const request: IGetMessagesApiRequest = {
          page,
          chatId: chat.id,
          searchString,
        };

        try {
          const { data } = GetMessages.httpRequest.call(
            yield call(() => GetMessages.httpRequest.generator(request)),
          );

          const newMessages = data.map((message) => ({
            ...message,
            state:
              chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= message.id
                ? MessageState.READ
                : MessageState.SENT,
          }));

          const {
            entities: { messages, users },
            result,
          } = normalize<IMessage[], { messages: INormalizedMessage[]; users: IUser[] }, number[]>(
            newMessages,
            messageArrNormalizationSchema,
          );

          const messageList = {
            chatId: chat.id,
            messages,
            messageIds: result,
            hasMoreMessages: newMessages.length >= page.limit,
            searchString,
            isFromSearch,
          };

          yield put(GetMessagesSuccess.action({ messageList }));
          yield put(UpdateUsersList.action({ users }));
        } catch {
          yield put(GetMessagesFailure.action(chat.id));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage[]>, IGetMessagesApiRequest>(
      MAIN_API.GET_MESSAGES,
      HttpRequestMethod.Post,
    );
  }
}
