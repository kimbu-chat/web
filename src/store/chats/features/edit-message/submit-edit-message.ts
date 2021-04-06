import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector, getChatByIdDraftSelector } from '../../selectors';

import { ISumbitEditMessageActionPayload } from './action-payloads/submit-edit-message-action-payload';
import { SubmitEditMessageSuccess } from './sumbit-edit-message-success';
import { ISubmitEditMessageApiRequest } from './api-requests/submit-edit-message-api-request';
import { IChatsState } from '../../chats-state';

export class SubmitEditMessage {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE')<ISumbitEditMessageActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessage.action>) => {
        const { text } = payload;
        if (draft.selectedChatId) {
          const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

          if (chat?.messageToEdit) {
            chat.attachmentsToSend = [];

            if (chat.lastMessage?.id === chat?.messageToEdit.id) {
              chat.lastMessage.text = text;
            }

            chat.messageToEdit = undefined;
          }
        }

        return draft;
      },
    );
  }

  static get saga() {
    return function* submitEditMessage(
      action: ReturnType<typeof SubmitEditMessage.action>,
    ): SagaIterator {
      const { removedAttachments, newAttachments, text, messageId } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const editRequest: ISubmitEditMessageApiRequest = {
        text,
        messageId,
        removedAttachments,
        newAttachments,
      };

      const { status } = SubmitEditMessage.httpRequest.call(
        yield call(() => SubmitEditMessage.httpRequest.generator(editRequest)),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(
          SubmitEditMessageSuccess.action({
            text,
            messageId,
            removedAttachments,
            newAttachments,
            chatId,
          }),
        );
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, ISubmitEditMessageApiRequest>(
      MAIN_API.MESSAGES,
      HttpRequestMethod.Put,
    );
  }
}
