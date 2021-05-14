import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { NOTIFICATIONS_API } from '@common/paths';

import { myFullNameSelector } from '../../../my-profile/selectors';
import { getSelectedChatIdSelector, getChatByIdDraftSelector } from '../../selectors';
import { IChatsState } from '../../chats-state';

import { IMessageTypingActionPayload } from './action-payloads/message-typing-action-payload';
import { IMessageTypingApiRequest } from './api-requests/message-typing-api-request';

export class MessageTyping {
  static get action() {
    return createAction('NOTIFY_USER_ABOUT_MESSAGE_TYPING')<IMessageTypingActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessageTyping.action>) => {
      const { text } = payload;
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.draftMessage = text;
        }
      }

      return draft;
    });
  }

  static get saga() {
    return function* messageTypingSaga({
      payload,
    }: ReturnType<typeof MessageTyping.action>): SagaIterator {
      const { text } = payload;
      const chatId = yield select(getSelectedChatIdSelector);
      const interlocutorName = yield select(myFullNameSelector);
      yield call(() => MessageTyping.httpRequest.generator({ interlocutorName, chatId, text }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IMessageTypingApiRequest>(
      NOTIFICATIONS_API.MESSAGE_TYPING,
      HttpRequestMethod.Post,
    );
  }
}
