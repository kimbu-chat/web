import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createDeferredAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { ChatId } from '../../chat-id';
import { IChatsState } from '../../chats-state';

import { IRemoveChatRequest } from './api-requests/remove-chat-api-request';
import { RemoveChatSuccess } from './remove-chat-success';

export interface IRemoveChatActionPayload {
  forEveryone: boolean;
  chatId: number;
}

export class RemoveChat {
  static get action() {
    return createDeferredAction<IRemoveChatActionPayload>('REMOVE_CHAT');
  }

  static get reducer() {
    return (draft: IChatsState) => {
      draft.chatInfo = {
        isInfoOpened: false,
      };

      return draft;
    };
  }

  static get saga() {
    return function* removeChatSaga(action: ReturnType<typeof RemoveChat.action>): SagaIterator {
      const { chatId, forEveryone } = action.payload;
      const { userId } = ChatId.fromId(chatId);

      if (userId) {
        const { status } = RemoveChat.httpRequest.call(
          yield call(() => RemoveChat.httpRequest.generator({ userId, forEveryone })),
        );

        // TODO: handle user deleteing

        if (status === HTTPStatusCode.OK) {
          yield put(RemoveChatSuccess.action({ chatId }));
          action.meta?.deferred?.resolve();
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IRemoveChatRequest>(
      ({ userId, forEveryone }: IRemoveChatRequest) =>
        replaceInUrl(MAIN_API.REMOVE_CHAT, ['userId', userId], ['forEveryone', forEveryone]),
      HttpRequestMethod.Delete,
    );
  }
}
