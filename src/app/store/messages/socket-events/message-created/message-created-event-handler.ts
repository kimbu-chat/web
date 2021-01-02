import { IMessageList, SystemMessageType } from 'store/messages/models';
import { createAction } from 'typesafe-actions';
import { SagaIterator } from 'redux-saga';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { ChatActions } from 'app/store/chats/actions';
import { ChangeSelectedChat } from 'app/store/chats/features/change-selected-chat/change-selected-chat';
import { MarkMessagesAsRead } from 'app/store/chats/features/mark-messages-as-read/mark-messages-as-read';
import { IMarkMessagesAsReadRequest, IChat, IChatsState } from 'app/store/chats/models';
import { getSelectedChatIdSelector, getChatById, getChats, getChatListChatIndex } from 'app/store/chats/selectors';
import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { areNotificationsEnabled } from 'app/store/settings/selectors';
import { select, put, call } from 'redux-saga/effects';
import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { RootState } from 'app/store/root-reducer';
import { SetStore } from 'app/store/set-store';
import produce from 'immer';
import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';
import { getMessagesChatIndex } from '../../selectors';

export class MessageCreatedEventHandler {
  static get action() {
    return createAction('MessageCreated')<IMessageCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MessageCreatedEventHandler.action>): SagaIterator {
      const currentUserId = yield select(getMyIdSelector);
      const message = action.payload;

      if (message.systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
        if (message.userCreator.id === currentUserId) {
          return;
        }
      }

      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        // messages insertion
        const chatMessagesIndex = getMessagesChatIndex(draft.messages, message.chatId);

        if (chatMessagesIndex === -1) {
          const messageList: IMessageList = {
            chatId: message.chatId,
            messages: [message],
            hasMoreMessages: true,
          };
          draft.messages.messages.unshift(messageList);

          return draft;
        }

        if (draft.messages.messages[chatMessagesIndex].messages.findIndex(({ id }) => id === message.id) === -1) {
          draft.messages.messages[chatMessagesIndex].messages.unshift(message);
        }

        // chat insertion
        const chatListIndex: number = getChatListChatIndex(message.chatId, draft.chats as IChatsState);

        const isCurrentUserMessageCreator: boolean = currentUserId === message.userCreator?.id;

        // if user already has chats with interlocutor - update chat
        if (chatListIndex >= 0) {
          const isInterlocutorCurrentSelectedChat: boolean = draft.chats.selectedChatId === message.chatId;
          const previousUnreadMessagesCount = draft.chats.chats[chatListIndex].unreadMessagesCount || 0;
          const unreadMessagesCount =
            isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator ? previousUnreadMessagesCount : previousUnreadMessagesCount + 1;

          draft.chats.chats[chatListIndex].attachmentsToSend = [];
          draft.chats.chats[chatListIndex].lastMessage = { ...message };
          draft.chats.chats[chatListIndex].unreadMessagesCount = unreadMessagesCount;
          draft.chats.chats[chatListIndex].draftMessage = '';

          const chatWithNewMessage = draft.chats.chats[chatListIndex];

          draft.chats.chats.splice(chatListIndex, 1);

          console.log('chat unshifted');

          draft.chats.chats.unshift(chatWithNewMessage);
        }

        return draft;
      });

      yield put(SetStore.action(nextState as RootState));

      const selectedChatId = yield select(getSelectedChatIdSelector);

      if (selectedChatId === message.chatId) {
        if (!selectedChatId || !message.userCreator || currentUserId === message.userCreator?.id || message.systemMessageType !== SystemMessageType.None) {
          return;
        }
        const isChatCurrentInterlocutor = message.chatId === selectedChatId;
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
      const chatOfMessage: IChat | undefined = yield select(getChatById(message.chatId));
      const isAudioPlayAllowed = yield select(areNotificationsEnabled);
      const chats: IChat[] = yield select(getChats);

      if (isAudioPlayAllowed && chatOfMessage) {
        if (message.userCreator?.id !== currentUserId && !(selectedChatId !== message.chatId) && !document.hidden && !chatOfMessage.isMuted) {
          const audioSelected = new Audio(messageCameSelected);
          audioSelected.play();
        }

        if ((selectedChatId !== message.chatId || document.hidden) && !chatOfMessage.isMuted) {
          const audioUnselected = new Audio(messageCameUnselected);
          audioUnselected.play();
        }
      }

      if (chats.findIndex(({ id }) => id === message.chatId) === -1) {
        const { data, status } = ChangeSelectedChat.httpRequest.getChat.call(
          yield call(() => ChangeSelectedChat.httpRequest.getChat.generator({ chatId: message.chatId })),
        );

        if (status === HTTPStatusCode.OK) {
          yield put(ChatActions.unshiftChat(data));
        } else {
          alert('getChatInfo in createMessageSaga error');
        }
      }
    };
  }
}
