import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IChat, IChatInfo, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedChat } from '@store/chats/models';
import { chatNormalizationSchema } from '@store/chats/normalization';
import { getChatByIdSelector } from '@store/chats/selectors';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { replaceInUrl } from '@utils/replace-in-url';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { ChangeSelectedChat } from '../change-selected-chat/change-selected-chat';
import { UnshiftChat } from '../unshift-chat/unshift-chat';

import { GetChatInfoSuccess } from './get-chat-info-success';

export interface IGetChatInfoActionPayload {
  chatId: number;
}


export class GetChatInfo {
  static get action() {
    return createAction<number>('GET_CHAT_INFO');
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
        } = normalize<IChat[],
          { chats: Record<number, INormalizedChat>; users: Record<number, IUser> },
          number[]>(data, chatNormalizationSchema);

        if (chats) {
          yield put(UnshiftChat.action({ chat: chats[data.id as number], addToList: false }));
        }

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
