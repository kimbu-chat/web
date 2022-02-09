import { AxiosResponse } from 'axios';
import {
  ILinkedMessage,
  IUser,
  IChat,
  IMessage,
  SystemMessageType,
  MessageLinkType,
  IMarkChatAsReadRequest,
  IGroupChatMemberRemovedSystemMessage,
} from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { MAIN_API } from '@common/paths';
import { MarkMessagesAsRead } from '@store/chats/features/mark-messages-as-read/mark-messages-as-read';
import { INormalizedLinkedMessage, INormalizedChat, INormalizedMessage } from '@store/chats/models';
import {
  chatNormalizationSchema,
  linkedMessageNormalizationSchema,
} from '@store/chats/normalization';
import { setUnreadMessageId } from '@store/chats/utils/unread-message';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { areNotificationsEnabledSelector } from '@store/settings/selectors';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { playSoundSafely } from '@utils/current-music';
import { getSystemMessageData } from '@utils/message-utils';
import { replaceInUrl } from '@utils/replace-in-url';
import { setNewTitleNotificationInterval, incrementNotifications } from '@utils/set-favicon';

import messageCameSelected from '../../../../assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from '../../../../assets/sounds/notifications/messsage-came-unselected.ogg';
import { tabActiveSelector, myIdSelector } from '../../../my-profile/selectors';
import { ChangeSelectedChat } from '../../features/change-selected-chat/change-selected-chat';
import { UnshiftChat } from '../../features/unshift-chat/unshift-chat';
import {
  getSelectedChatIdSelector,
  getChatByIdSelector,
  getChatHasMessageWithIdSelector,
  getMessageSelector,
  getChatHasLastMessageSelector,
} from '../../selectors';

import { MessageCreatedEventHandlerSuccess } from './message-created-event-handler-success';
import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';

export class MessageCreatedEventHandler {
  static get action() {
    return createAction('MessageCreated')<IMessageCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* messageCreatedEventHandler({
      payload,
    }: ReturnType<typeof MessageCreatedEventHandler.action>): SagaIterator {
      const {
        chatId,
        id,
        userCreator,
        linkedMessageId,
        clientId,
        linkedMessageType,
        systemMessageType,
      } = payload;

      yield put(AddOrUpdateUsers.action({ users: { [userCreator.id]: userCreator } }));

      const messageExists =
        (yield select(getChatHasMessageWithIdSelector(id, chatId))) ||
        (yield select(getChatHasMessageWithIdSelector(clientId, chatId)));

      if (messageExists) {
        const chatHasLastMessage = yield select(getChatHasLastMessageSelector(chatId));

        if (!chatHasLastMessage && systemMessageType === SystemMessageType.GroupChatCreated) {
          const chat: INormalizedChat = yield select(getChatByIdSelector(chatId));

          const message: INormalizedMessage = yield select(getMessageSelector(chatId, id));

          const updatedChat = { ...chat, lastMessage: message };

          yield put(UnshiftChat.action({ chat: updatedChat, addToList: false }));
        }

        return;
      }

      const myId = yield select(myIdSelector);

      if (systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
        const systemMessage = getSystemMessageData<IGroupChatMemberRemovedSystemMessage>(payload);

        if (userCreator.id === myId && systemMessage.removedUserId === myId) {
          return;
        }
      }

      const isTabActive = yield select(tabActiveSelector);
      const selectedChatId = yield select(getSelectedChatIdSelector);

      let linkedMessage: INormalizedLinkedMessage | undefined;

      if (linkedMessageType === MessageLinkType.Reply) {
        linkedMessage = yield select(getMessageSelector(chatId, linkedMessageId));
      }

      if (linkedMessageId && !linkedMessage) {
        const { data }: AxiosResponse<IMessage> = MessageCreatedEventHandler.httpRequest.call(
          yield call(() => MessageCreatedEventHandler.httpRequest.generator(linkedMessageId)),
        );

        if (data) {
          const {
            entities: { linkedMessages, users },
          } = normalize<
            ILinkedMessage[],
            {
              linkedMessages: Record<number, INormalizedLinkedMessage>;
              users: Record<number, IUser>;
            },
            number[]
          >(data, linkedMessageNormalizationSchema);
          const normalizedLinkedMessage = linkedMessages[data.id];
          if (normalizedLinkedMessage) {
            linkedMessage = normalizedLinkedMessage;
            yield put(AddOrUpdateUsers.action({ users }));
          }
        }
      }

      // notifications play
      let chatOfMessage: IChat | undefined = yield select(getChatByIdSelector(chatId));
      const isAudioPlayAllowed = yield select(areNotificationsEnabledSelector);
      let isNewChat = false;

      if (!chatOfMessage) {
        isNewChat = true;
        const { data } = ChangeSelectedChat.httpRequest.call(
          yield call(() => ChangeSelectedChat.httpRequest.generator(chatId)),
        );

        if (data) {
          const {
            entities: { chats, users },
          } = normalize<
            IChat[],
            { chats?: Record<number, INormalizedChat>; users: Record<number, IUser> },
            number[]
          >(data, chatNormalizationSchema);

          yield put(AddOrUpdateUsers.action({ users }));

          if (chats) {
            yield put(UnshiftChat.action({ chat: chats[data.id as number], addToList: true }));
          }

          chatOfMessage = data;
        }
      }

      yield put(MessageCreatedEventHandlerSuccess.action({ linkedMessage, isNewChat, ...payload }));

      if (userCreator?.id !== myId) {
        if (chatOfMessage && isAudioPlayAllowed && !chatOfMessage.isMuted) {
          if (selectedChatId === chatId && !document.hidden) {
            const audioSelected = new Audio(messageCameSelected);
            playSoundSafely(audioSelected);
          }

          if (selectedChatId !== chatId || document.hidden) {
            const audioUnselected = new Audio(messageCameUnselected);
            playSoundSafely(audioUnselected);
          }
        }

        if (!isTabActive) {
          incrementNotifications();
          yield call(setNewTitleNotificationInterval);
        }
      }

      if (selectedChatId === chatId) {
        if (myId !== userCreator?.id) {
          if (isTabActive) {
            const httpRequestPayload: IMarkChatAsReadRequest = {
              chatId: selectedChatId,
              lastReadMessageId: id,
            };

            yield call(() => MarkMessagesAsRead.httpRequest.generator(httpRequestPayload));
          } else {
            setUnreadMessageId(id);
          }
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage>, number>(
      (messageId: number) => replaceInUrl(MAIN_API.GET_MESSAGE_BY_ID, ['messageId', messageId]),
      HttpRequestMethod.Get,
    );
  }
}
