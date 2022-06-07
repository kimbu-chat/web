import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse, CancelTokenSource } from 'axios';
import { ICreateMessageRequest, ICreateMessageResponse, MessageLinkType } from 'kimbu-models';
import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { DiscardDraftMessage } from '@store/chats/features/create-draft-message/discard-draft-message';
import { MessageAttachmentsUploaded } from '@store/chats/features/upload-attachment/message-attachments-uploaded';
import { IAttachmentToSend, INormalizedChat, INormalizedMessage, MessageState } from '@store/chats/models';
import { getChatByIdSelector, getMessageSelector, getSelectedChatIdSelector } from '@store/chats/selectors';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { addMessageSendingRequest } from '@utils/cancel-send-message-request';

import { IChatsState } from '../../chats-state';

import { CreateMessageSuccess } from './create-message-success';

export interface ICreateMessageActionPayload {
  linkedMessage?: INormalizedMessage;
  linkedMessageType?: MessageLinkType;
  text: string;
}

export class CreateMessage {
  static get action() {
    return createAction<ICreateMessageActionPayload>('CREATE_MESSAGE');
  }

  static get reducer() {
    return (draft: IChatsState, { payload }: ReturnType<typeof CreateMessage.action>) => {
      const chat = draft.chats[draft.selectedChatId as number];
      const { text, linkedMessage, linkedMessageType } = payload;

      if (chat) {
        chat.lastMessageId = chat.draftMessageId as number;
        delete chat.messageToReply;

        const chatIndex = draft.chatList.chatIds.indexOf(chat.id);
        if (chatIndex !== 0) {
          draft.chatList.chatIds.splice(chatIndex, 1);

          draft.chatList.chatIds.unshift(chat.id);
        }
      }

      if (chat.messages && chat.draftMessageId) {
        const draftMessage = chat.messages.messages[chat.draftMessageId];
        draftMessage.text = text;
        draftMessage.state = MessageState.QUEUED;
        draftMessage.linkedMessage = linkedMessage;
        draftMessage.linkedMessageType = linkedMessageType;
        chat.messages.messageIds.unshift(chat.draftMessageId);
      }
      return draft;
    };
  }

  static get saga() {
    return function* createMessage(action: ReturnType<typeof CreateMessage.action>): SagaIterator {
      const { text } = action.payload;

      const selectedChatId: number = yield select(getSelectedChatIdSelector);
      const { draftMessageId }: INormalizedChat = yield select(getChatByIdSelector(selectedChatId));
      const chat = yield select(getChatByIdSelector(selectedChatId));
      const message = yield select(getMessageSelector(selectedChatId, draftMessageId as number));

      let uploadedAttachments = [];

      const messageCreationReq: ICreateMessageRequest = {
        text,
        chatId: selectedChatId,
        attachmentIds: [],
        clientId: message.id,
      };

      if (draftMessageId) {
        yield put(DiscardDraftMessage.action(selectedChatId));

        const attachmentsToSend = chat.messages.messages[draftMessageId].attachments;

        const hasNotUploadedAttachments = attachmentsToSend.some(
          (attachment: IAttachmentToSend) => attachment.success === false,
        );

        if (hasNotUploadedAttachments) {
          yield take(MessageAttachmentsUploaded.action);
        }

        const reselectedChat = yield select(getChatByIdSelector(selectedChatId));

        const newAttachments = reselectedChat.messages.messages[draftMessageId].attachments;

        messageCreationReq.attachmentIds = newAttachments.map(
          (attachment: IAttachmentToSend) => attachment.id,
        );
        uploadedAttachments = newAttachments;
      }

      if (message.linkedMessage && message.linkedMessageType) {
        messageCreationReq.link = {
          type: message.linkedMessageType,
          originalMessageId: message.linkedMessage.id,
        };
      }

      const response = CreateMessage.httpRequest.call(
        yield call(() =>
          CreateMessage.httpRequest.generator(
            messageCreationReq,
            (cancelToken: CancelTokenSource) => addMessageSendingRequest(message.id, cancelToken),
          ),
        ),
      );

      // if request was canceled, response is undefined and we shouldn't submit CreateMessageSuccess
      if (!response) {
        return;
      }

      yield put(
        CreateMessageSuccess.action({
          chatId: selectedChatId,
          draftMessageId: draftMessageId as number,
          newMessageId: response.data.id,
          messageState: MessageState.SENT,
          attachments: uploadedAttachments,
        }),
      );
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICreateMessageResponse>, ICreateMessageRequest>(
      MAIN_API.MESSAGES,
      HttpRequestMethod.Post,
    );
  }
}
