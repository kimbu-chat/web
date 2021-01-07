import { getSelectedChatIdSelector } from 'store/chats/selectors';
import { IChatsState } from 'store/chats/models';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatByIdDraftSelector } from '../../selectors';
import { ISumbitEditMessageActionPayload } from './action-payloads/submit-edit-message-action-payload';
import { SubmitEditMessageSuccess } from './sumbit-edit-message-success';
import { ISubmitEditMessageApiRequest } from './api-requests/submit-edit-message-api-request';

export class SubmitEditMessage {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE')<ISumbitEditMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessage.action>) => {
      const { text } = payload;

      const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);

      if (chat && draft.messageToEdit) {
        chat.attachmentsToSend = [];

        if (chat.lastMessage?.id === draft.messageToEdit.id) {
          chat.lastMessage!.text = text;
        }
      }

      draft.selectedMessageIds = [];

      draft.messageToEdit = undefined;

      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof SubmitEditMessage.action>): SagaIterator {
      const { removedAttachments, newAttachments, text, messageId } = action.payload;
      const chatId = yield select(getSelectedChatIdSelector);

      const editRequest: ISubmitEditMessageApiRequest = {
        text,
        messageId,
        removedAttachments,
        newAttachments,
      };

      const { status } = SubmitEditMessage.httpRequest.call(yield call(() => SubmitEditMessage.httpRequest.generator(editRequest)));

      if (status === HTTPStatusCode.OK) {
        yield put(SubmitEditMessageSuccess.action({ text, messageId, removedAttachments, newAttachments, chatId }));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, ISubmitEditMessageApiRequest>(`${process.env.MAIN_API}/api/messages`, HttpRequestMethod.Put);
  }
}
