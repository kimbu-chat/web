import { HTTPStatusCode } from 'app/common/http-status-code';
import { MyProfileService } from 'app/services/my-profile-service';
import { areNotificationsEnabledSelector } from 'app/store/settings/selectors';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { ChangeSelectedChat } from '../../features/change-selected-chat/change-selected-chat';
import { MarkMessagesAsRead } from '../../features/mark-messages-as-read/mark-messages-as-read';
import { IChatsState, SystemMessageType, IChat } from '../../models';
import { getChatIndexDraftSelector, getSelectedChatIdSelector, getChatByIdSelector, getChatsSelector } from '../../selectors';
import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';
import { UnshiftChat } from '../../features/unshift-chat/unshift-chat';
import { IMarkMessagesAsReadApiRequest } from '../../features/mark-messages-as-read/api-requests/mark-messages-as-read-api-request';

export class MessageCreatedEventHandler {
  static get action() {
    return createAction('MessageCreated')<IMessageCreatedIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof MessageCreatedEventHandler.action>) => {
      const message = payload;
      const myId = new MyProfileService().myProfile.id;
      const isCurrentUserMessageCreator: boolean = myId === message.userCreator?.id;

      if (message.systemMessageType === SystemMessageType.GroupChatMemberRemoved && isCurrentUserMessageCreator) {
        return draft;
      }

      const chatIndex = getChatIndexDraftSelector(message.chatId, draft);
      const chat = draft.chats[chatIndex];

      // if user already has chats with interlocutor - update chat
      if (chat) {
        const isInterlocutorCurrentSelectedChat = draft.selectedChatId === message.chatId;
        const previousUnreadMessagesCount = chat.unreadMessagesCount;
        const newUnreadMessagesCount =
          isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator ? previousUnreadMessagesCount : previousUnreadMessagesCount + 1;

        chat.messages.messages.unshift(message);
        chat.lastMessage = message;
        chat.unreadMessagesCount = newUnreadMessagesCount;
        chat.draftMessage = '';

        const chatWithNewMessage = chat;

        if (chatIndex !== 0) {
          draft.chats.splice(chatIndex, 1);

          draft.chats.unshift(chatWithNewMessage);
        }
      }

      return draft;
    });
  }

  static get saga() {
    return function* (action: ReturnType<typeof MessageCreatedEventHandler.action>): SagaIterator {
      const message = action.payload;

      const selectedChatId = yield select(getSelectedChatIdSelector);
      const myId = new MyProfileService().myProfile.id;

      if (selectedChatId === message.chatId) {
        if (!(myId === message.userCreator?.id)) {
          const httpRequestPayload: IMarkMessagesAsReadApiRequest = {
            chatId: selectedChatId,
            lastReadMessageId: message.id,
          };

          console.log('new message in Selected chat');
          MarkMessagesAsRead.httpRequest.call(yield call(() => MarkMessagesAsRead.httpRequest.generator(httpRequestPayload)));
        }
      }
      // notifications play
      const chatOfMessage: IChat | undefined = yield select(getChatByIdSelector(message.chatId));
      const isAudioPlayAllowed = yield select(areNotificationsEnabledSelector);
      const chats: IChat[] = yield select(getChatsSelector);

      if (chats.findIndex(({ id }) => id === message.chatId) === -1) {
        const { data, status } = ChangeSelectedChat.httpRequest.getChat.call(
          yield call(() => ChangeSelectedChat.httpRequest.getChat.generator({ chatId: message.chatId })),
        );

        if (status === HTTPStatusCode.OK) {
          yield put(UnshiftChat.action(data));
        } else {
          alert('getChatInfo in createMessageSaga error');
        }
      }

      if (isAudioPlayAllowed && chatOfMessage && message.userCreator?.id !== myId) {
        if (!(selectedChatId !== message.chatId) && !document.hidden && !chatOfMessage.isMuted) {
          const audioSelected = new Audio(messageCameSelected);
          audioSelected.play();
        }

        if ((selectedChatId !== message.chatId || document.hidden) && !chatOfMessage.isMuted) {
          const audioUnselected = new Audio(messageCameUnselected);
          audioUnselected.play();
        }
      }
    };
  }
}
