import { HTTPStatusCode } from 'app/common/http-status-code';
import { ChatActions } from 'app/store/chats/actions';
import { ChatHttpRequests } from 'app/store/chats/http-requests';
import { Chat, MarkMessagesAsReadRequest } from 'app/store/chats/models';
import { getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { RootState } from 'app/store/root-reducer';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { getChatIndex } from '../messages-utils';
import { CreateMessageRequest, MessageCreationReqData, MessageList, MessagesState, MessageState, SystemMessageType } from '../models';
import { CreateMessageSuccess } from './create-message-success';

export class CreateMessage {
  static get action() {
    return createAction('CREATE_MESSAGE')<CreateMessageRequest>();
  }

  static get reducer() {
    return produce((draft: MessagesState, { payload }: ReturnType<typeof CreateMessage.action>) => {
      const { chatId, message } = payload;
      const chatIndex = getChatIndex(draft, chatId);

      if (chatIndex === -1) {
        const messageList: MessageList = {
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
          const currentUserId = yield select((state: RootState) => state.myProfile.user?.id);

          if (!selectedChatId || !message.userCreator || currentUserId === message.userCreator?.id || message.systemMessageType !== SystemMessageType.None) {
            return;
          }
          const isChatCurrentInterlocutor: boolean = chatId === selectedChatId;
          if (isChatCurrentInterlocutor) {
            const httpRequestPayload: MarkMessagesAsReadRequest = {
              chatId: selectedChatId,
              lastReadMessageId: message.id,
            };
            const httpRequest = ChatHttpRequests.markMessagesAsRead;
            httpRequest.call(yield call(() => httpRequest.generator(httpRequestPayload)));
          } else {
            console.warn('notifyInterlocutorThatMessageWasRead Error');
          }
        }
        // notifications play
        const currentUserId = yield select((state: RootState) => state.myProfile.user?.id);
        const chatOfMessage = yield select((state: RootState) => state.chats.chats.find(({ id }) => id === chatId));
        const isAudioPlayAllowed = yield select((state: RootState) => state.settings.notificationSound);
        const chats: Chat[] = yield select((state: RootState) => state.chats.chats);

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
          const httpRequest = ChatHttpRequests.getChatById;

          const { data, status } = httpRequest.call(yield call(() => httpRequest.generator({ chatId })));

          if (status === HTTPStatusCode.OK) {
            yield put(ChatActions.unshiftChat(data));
          } else {
            alert('getChatInfoSaga error');
          }
        }
      } else {
        const attachmentsToSend = message.attachments?.map(({ id, type }) => ({ id, type })) || [];
        try {
          const messageCreationReq: MessageCreationReqData = {
            text: message.text,
            chatId,
            attachments: attachmentsToSend,
          };

          const { httpRequest } = CreateMessage;
          const { data } = httpRequest.call(yield call(() => httpRequest.generator(messageCreationReq)));

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
    return httpRequestFactory<AxiosResponse<number>, MessageCreationReqData>(`${ApiBasePath.MainApi}/api/messages`, HttpRequestMethod.Post);
  }
}
