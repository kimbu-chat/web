import { AxiosResponse } from 'axios';
import produce from 'immer';
import { INotifyAboutUserMessageTypingRequest } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { DraftMessageStatus } from '@common/constants/chats';
import { MAIN_API } from '@common/paths';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { myFullNameSelector } from '@store/my-profile/selectors';

import { IChatsState } from '../../chats-state';
import { getChatByIdDraftSelector, getSelectedChatIdSelector } from '../../selectors';

import { IMessageTypingActionPayload } from './action-payloads/message-typing-action-payload';

export class MessageTyping {
  static get action() {
    return createAction('NOTIFY_USER_ABOUT_MESSAGE_TYPING')<IMessageTypingActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessageTyping.action>) => {
      const { text, id } = payload;
      if (draft.selectedChatId) {
        const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

        if (chat) {
          chat.draftMessages[id] = {
            ...chat.draftMessages[id],
            id,
            text,
            status: DraftMessageStatus.CREATING,
          };
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
      MAIN_API.MESSAGE_TYPING,
      HttpRequestMethod.Post,
    );
  }
}
