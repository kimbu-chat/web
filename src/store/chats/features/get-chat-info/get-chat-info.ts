import { AxiosResponse } from 'axios';
import { IChat, IChatInfo, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { INormalizedChat } from '@store/chats/models';
import { chatNormalizationSchema } from '@store/chats/normalization';
import { getChatByIdSelector } from '@store/chats/selectors';
import { modelChatList } from '@store/chats/utils/model-chat-list';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { replaceInUrl } from '@utils/replace-in-url';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { ChangeSelectedChat } from '../change-selected-chat/change-selected-chat';
import { UnshiftChat } from '../unshift-chat/unshift-chat';

import { GetChatInfoSuccess } from './get-chat-info-success';

export class GetChatInfo {
  static get action() {
    return createAction('GET_CHAT_INFO')<number>();
  }

  static get saga() {
    return function* getChatInfoSaga(action: ReturnType<typeof GetChatInfo.action>): SagaIterator {
      const chatId = action.payload;

      const chat = yield select(getChatByIdSelector(chatId));
      const chatExists = chat !== undefined && !chat.isGeneratedLocally;

      if (!chatExists) {
        const { data } = ChangeSelectedChat.httpRequest.call(
          yield call(() => ChangeSelectedChat.httpRequest.generator(action.payload)),
        );

        const {
          entities: { chats, users },
        } = normalize<
          IChat[],
          { chats: Record<number, INormalizedChat>; users: Record<number, IUser> },
          number[]
        >(data, chatNormalizationSchema);

        const modeledChat = modelChatList(chats)[data.id as number];

        yield put(UnshiftChat.action({ chat: modeledChat as INormalizedChat, addToList: false }));
        yield put(AddOrUpdateUsers.action({ users }));
      }

      const { data, status } = GetChatInfo.httpRequest.call(
        yield call(() => GetChatInfo.httpRequest.generator(chatId)),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(GetChatInfoSuccess.action({ ...data, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IChatInfo>, number>(
      (chatId: number) => replaceInUrl(MAIN_API.GET_CHAT_INFO, ['chatId', chatId]),
      HttpRequestMethod.Get,
    );
  }
}
