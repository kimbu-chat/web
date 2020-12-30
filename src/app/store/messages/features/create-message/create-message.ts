import { HTTPStatusCode } from 'app/common/http-status-code';
import { ChatActions } from 'app/store/chats/actions';
import { IChat, IMarkMessagesAsReadRequest } from 'app/store/chats/models';
import { getChatById, getChats, getSelectedChatIdSelector } from 'app/store/chats/selectors';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { MarkMessagesAsRead } from 'app/store/chats/features/mark-messages-as-read/mark-messages-as-read';
import { ChangeSelectedChat } from 'app/store/chats/features/change-selected-chat/change-selected-chat';
import { getChatIndex } from 'app/store/messages/selectors';
import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { areNotificationsEnabled } from 'app/store/settings/selectors';
import { IMessageCreationReqData, IMessageList, IMessagesState, MessageState, SystemMessageType } from '../../models';
import { CreateMessageSuccess } from './create-message-success';
import { ICreateMessageActionPayload } from './create-message-action-payload';

export class CreateMessage {
  static get action() {
    return createAction('CREATE_MESSAGE')<ICreateMessageActionPayload>();
  }

  static get reducer() {
    return produce((draft: IMessagesState, { payload }: ReturnType<typeof CreateMessage.action>) => {
      const { chatId, message } = payload;
      const chatIndex = getChatIndex(draft, chatId);

      if (chatIndex === -1) {
        const messageList: IMessageList = {
          chatId,
          messages: [message],
          hasMoreMessages: false,
        };
        draft.messages.unshift(messageList);

        return draft;
      }

      if (draft.messages[chatIndex].messages.findIndex(({ id }) => id === message.id) === -1) {
        draft.messages[chatIndex].messages.unshift(message);
      }
      return draft;
    });
  }

  static get saga() {
    return function* createMessage(action: ReturnType<typeof CreateMessage.action>): SagaIterator {
      const { message, chatId, isFromEvent } = action.payload;
      const selectedChatId = yield select(getSelectedChatIdSelector);

      if (isFromEvent) {
        if (selectedChatId === chatId) {
          const { chatId, message } = action.payload;
          const selectedChatId = yield select(getSelectedChatIdSelector);
          const currentUserId = yield select(getMyIdSelector);

          if (!selectedChatId || !message.userCreator || currentUserId === message.userCreator?.id || message.systemMessageType !== SystemMessageType.None) {
            return;
          }
          const isChatCurrentInterlocutor: boolean = chatId === selectedChatId;
          if (isChatCurrentInterlocutor) {
            const httpRequestPayload: IMarkMessagesAsReadRequest = {
              chatId: selectedChatId,
              lastReadMessageId: message.id,
            };

            MarkMessagesAsRead.httpRequest.call(yield call(() => MarkMessagesAsRead.httpRequest.generator(httpRequestPayload)));
          } else {
            console.warn('notifyInterlocutorThatMessageWasRead Error');
          }
        }
        // notifications play
        const currentUserId = yield select(getMyIdSelector);
        const chatOfMessage = yield select(getChatById(chatId));
        const isAudioPlayAllowed = yield select(areNotificationsEnabled);
        const chats: IChat[] = yield select(getChats);

        if (isAudioPlayAllowed) {
          if (message.userCreator?.id !== currentUserId && !(selectedChatId !== message.chatId) && !document.hidden && !chatOfMessage.isMuted) {
            const audioSelected = new Audio(messageCameSelected);
            audioSelected.play();
          }

          if ((selectedChatId !== message.chatId || document.hidden) && !chatOfMessage.isMuted) {
            const audioUnselected = new Audio(messageCameUnselected);
            audioUnselected.play();
          }
        }

        if (chats.findIndex(({ id }) => id === chatId) === -1) {
          const { data, status } = ChangeSelectedChat.httpRequest.getChat.call(yield call(() => ChangeSelectedChat.httpRequest.getChat.generator({ chatId })));

          if (status === HTTPStatusCode.OK) {
            yield put(ChatActions.unshiftChat(data));
          } else {
            alert('getChatInfo in createMessageSaga error');
          }
        }
      } else {
        const attachmentsToSend = message.attachments?.map(({ id, type }) => ({ id, type })) || [];
        try {
          const messageCreationReq: IMessageCreationReqData = {
            text: message.text,
            chatId,
            attachments: attachmentsToSend,
          };

          const { data } = CreateMessage.httpRequest.call(yield call(() => CreateMessage.httpRequest.generator(messageCreationReq)));

          yield put(
            CreateMessageSuccess.action({
              chatId: message.chatId || 0,
              oldMessageId: message.id,
              newMessageId: data,
              messageState: MessageState.SENT,
              attachments: message.attachments,
            }),
          );
        } catch {
          alert('error message create');
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<number>, IMessageCreationReqData>(`${process.env.MAIN_API}/api/messages`, HttpRequestMethod.Post);
  }
}
