import { AxiosResponse } from 'axios';
import produce from 'immer';
import { INotifyAboutUserMessageTypingRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { NOTIFICATIONS_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { myFullNameSelector } from '../../../my-profile/selectors';
import { IChatsState } from '../../chats-state';
import { getSelectedChatIdSelector, getChatByIdDraftSelector } from '../../selectors';

import { IMessageTypingActionPayload } from './action-payloads/message-typing-action-payload';

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
    return function* messageTypingSaga(): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);
      const interlocutorName = yield select(myFullNameSelector);
      yield call(() => MessageTyping.httpRequest.generator({ interlocutorName, chatId }));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, INotifyAboutUserMessageTypingRequest>(
      NOTIFICATIONS_API.MESSAGE_TYPING,
      HttpRequestMethod.Post,
    );
  }
}
