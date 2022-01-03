import { AxiosResponse } from 'axios';
import produce from 'immer';
import { IEditMessageRequest } from 'kimbu-models';
import unionBy from 'lodash/unionBy';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { MessageState } from '@store/chats/models';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { IChatsState } from '../../chats-state';
import { getSelectedChatIdSelector, getChatByIdDraftSelector } from '../../selectors';

import { ISumbitEditMessageActionPayload } from './action-payloads/submit-edit-message-action-payload';
import { SubmitEditMessageSuccess } from './sumbit-edit-message-success';

export class SubmitEditMessage {
  static get action() {
    return createAction('SUBMIT_EDIT_MESSAGE')<ISumbitEditMessageActionPayload>();
  }

  static get reducer() {
    return produce(
      (draft: IChatsState, { payload }: ReturnType<typeof SubmitEditMessage.action>) => {
        const { messageId, removedAttachments, newAttachments, text } = payload;

        if (draft.selectedChatId) {
          const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);
          const message = draft.chats[draft.selectedChatId]?.messages.messages[messageId];

          let newAttachmentsToAssign = message?.attachments;

          if (removedAttachments?.length || newAttachments?.length) {
            newAttachmentsToAssign = unionBy(message?.attachments, newAttachments, 'id').filter(
              ({ id }) => {
                if (!removedAttachments) {
                  return true;
                }

                return (
                  removedAttachments?.findIndex(
                    (removedAttachment) => removedAttachment.id === id,
                  ) === -1
                );
              },
            );
          }
          if (message) {
            message.text = text;
            message.isEdited = true;
            message.state = MessageState.QUEUED;

            message.attachments = newAttachmentsToAssign;
          }

          if (chat?.messageToEdit) {
            delete chat.attachmentsToSend;

            delete chat.messageToEdit;
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

      const editRequest: IEditMessageRequest = {
        text,
        messageId,
        removedAttachmentIds: removedAttachments?.map((x) => x.id),
        newAttachmentIds: newAttachments?.map((x) => x.id),
      };

      const { status } = SubmitEditMessage.httpRequest.call(
        yield call(() => SubmitEditMessage.httpRequest.generator(editRequest)),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(
          SubmitEditMessageSuccess.action({
            messageId,
            chatId,
          }),
        );
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IEditMessageRequest>(
      MAIN_API.MESSAGES,
      HttpRequestMethod.Put,
    );
  }
}
