import { getSelectedChatIdSelector } from 'store/chats/selectors';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { myFullNameSelector } from 'app/store/my-profile/selectors';
import { getChatByIdDraftSelector } from '../../selectors';
import { IMessageTypingActionPayload } from './action-payloads/message-typing-action-payload';
import { IMessageTypingApiRequest } from './api-requests/message-typing-api-request';
import { IChatsState } from '../../chats-state';

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
    return function* ({ payload }: ReturnType<typeof MessageTyping.action>): SagaIterator {
      const { text } = payload;
      const chatId = yield select(getSelectedChatIdSelector);
      const interlocutorName = yield select(myFullNameSelector);

      MessageTyping.httpRequest.call(yield call(() => MessageTyping.httpRequest.generator({ interlocutorName, chatId, text })));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IMessageTypingApiRequest>(
      `${process.env.NOTIFICATIONS_API}/api/message/notify-interlocutor-about-message-typing`,
      HttpRequestMethod.Post,
    );
  }
}
