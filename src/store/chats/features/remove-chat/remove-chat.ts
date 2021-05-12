import { createAction } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';
import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';
import produce from 'immer';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { ChatId } from '../../chat-id';
import { IRemoveChatApiRequest } from './api-requests/remove-chat-api-request';
import { RemoveChatSuccess } from './remove-chat-success';
import { IRemoveChatActionPayload } from './action-payloads/remove-chat-action-payload';
import { IChatsState } from '../../chats-state';

export class RemoveChat {
  static get action() {
    return createAction('REMOVE_CHAT')<IRemoveChatActionPayload, Meta>();
  }

  static get reducer() {
    return produce((draft: IChatsState) => {
      draft.chatInfo = {
        isInfoOpened: false,
      };

      return draft;
    });
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
          action.meta.deferred.resolve();
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IRemoveChatApiRequest>(
      ({ userId, forEveryone }: IRemoveChatApiRequest) =>
        replaceInUrl(MAIN_API.REMOVE_CHAT, ['userId', userId], ['forEveryone', forEveryone]),
      HttpRequestMethod.Delete,
    );
  }
}
