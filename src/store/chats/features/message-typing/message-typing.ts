import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { INotifyAboutUserMessageTypingRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { myFullNameSelector } from '@store/my-profile/selectors';

import { IChatsState } from '../../chats-state';
import { getSelectedChatIdSelector, getChatByIdDraftSelector } from '../../selectors';

export interface IMessageTypingActionPayload {
  text: string;
}

export class MessageTyping {
  static get action() {
    return createAction<IMessageTypingActionPayload>('NOTIFY_USER_ABOUT_MESSAGE_TYPING');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof MessageTyping.action>) => {
      const { text } = payload;
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat && chat.draftMessageId) {
          chat.messages.messages[chat.draftMessageId].text = text;
        }
      }

      return draft;
    };
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
      MAIN_API.MESSAGE_TYPING,
      HttpRequestMethod.Post,
    );
  }
}
