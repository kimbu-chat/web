import { AxiosResponse } from 'axios';
import produce from 'immer';
import { unionBy } from 'lodash';
import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { MessageState } from '@store/chats/models';
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
        const { messageId, removedAttachments, newAttachments, text } = payload;
        if (draft.selectedChatId) {
          const chat = getChatByIdDraftSelector(draft.selectedChatId, draft);
          const message = draft.messages[draft.selectedChatId].messages.find(
            ({ id }) => id === messageId,
          );

          const newAttachmentsToAssign = unionBy(message?.attachments, newAttachments, 'id').filter(
            ({ id }) => {
              if (!removedAttachments) {
                return true;
              }

              const res =
                removedAttachments?.findIndex(
                  (removedAttachment) => removedAttachment.id === id,
                ) === -1;

              return res;
            },
          );

          if (message) {
            message.text = text;
            message.isEdited = true;
            message.state = MessageState.QUEUED;

            message.attachments = unionBy(message.attachments, newAttachmentsToAssign, 'id');
          }

          if (chat?.lastMessage) {
            if (chat?.lastMessage.id === messageId) {
              chat.lastMessage.text = text;
              chat.lastMessage.isEdited = true;

              chat.lastMessage.attachments = unionBy(
                chat.lastMessage.attachments,
                newAttachmentsToAssign,
                'id',
              );
            }

            if (
              chat?.lastMessage.linkedMessage &&
              chat?.lastMessage.linkedMessage.id === messageId
            ) {
              chat.lastMessage.state = MessageState.QUEUED;
              chat.lastMessage.linkedMessage.text = text;
              chat.lastMessage.linkedMessage.isEdited = true;

              chat.lastMessage.attachments = unionBy(
                chat.lastMessage.linkedMessage.attachments,
                newAttachmentsToAssign,
                'id',
              );
            }
          }

          if (chat?.messageToEdit) {
            chat.attachmentsToSend = [];

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
            messageId,
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
