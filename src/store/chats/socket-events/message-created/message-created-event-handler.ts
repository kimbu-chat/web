import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { normalize } from 'normalizr';

import { ILinkedMessage, INormalizedLinkedMessage } from '@store/chats/models/linked-message';
import { areNotificationsEnabledSelector } from '@store/settings/selectors';
import { setNewTitleNotificationInterval, incrementNotifications } from '@utils/set-favicon';
import { playSoundSafely } from '@utils/current-music';
import { modelChatList } from '@store/chats/utils/model-chat-list';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';
import { MAIN_API } from '@common/paths';
import {
  IGroupChatMemberRemovedSystemMessageContent,
  getSystemMessageData,
} from '@utils/message-utils';
import {
  chatNormalizationSchema,
  linkedMessageNormalizationSchema,
} from '@store/chats/normalization';
import { IUser } from '@store/common/models';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { ById } from '@store/chats/models/by-id';
import { setUnreadMessageId } from '@store/chats/utils/unread-message';
import { IMarkMessagesAsReadApiRequest } from '@store/chats/features/mark-messages-as-read/api-requests/mark-messages-as-read-api-request';
import { MarkMessagesAsRead } from '@store/chats/features/mark-messages-as-read/mark-messages-as-read';

import { MessageLinkType } from '../../models/linked-message-type';
import messageCameUnselected from '../../../../assets/sounds/notifications/messsage-came-unselected.ogg';
import messageCameSelected from '../../../../assets/sounds/notifications/messsage-came-selected.ogg';
import { tabActiveSelector, myIdSelector } from '../../../my-profile/selectors';
import { ChangeSelectedChat } from '../../features/change-selected-chat/change-selected-chat';
import { IChat, INormalizedChat, IMessage, SystemMessageType } from '../../models';
import {
  getSelectedChatIdSelector,
  getChatByIdSelector,
  getChatHasMessageWithIdSelector,
  getMessageSelector,
} from '../../selectors';
import { UnshiftChat } from '../../features/unshift-chat/unshift-chat';

import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';
import { IGetMessageByIdApiRequest } from './api-requests/get-message-by-id-api-request';
import { MessageCreatedEventHandlerSuccess } from './message-created-event-handler-success';

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

      const messageExists =
        (yield select(getChatHasMessageWithIdSelector(id, chatId))) ||
        (yield select(getChatHasMessageWithIdSelector(clientId, chatId)));

      if (messageExists) {
        return;
      }

      const myId: number = yield select(myIdSelector);

      if (systemMessageType === SystemMessageType.GroupChatMemberRemoved) {
        const systemMessage = getSystemMessageData<IGroupChatMemberRemovedSystemMessageContent>(
          payload,
        );

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
          yield call(() =>
            MessageCreatedEventHandler.httpRequest.generator({ messageId: linkedMessageId }),
          ),
        );

        if (data) {
          const {
            entities: { linkedMessages, users },
          } = normalize<
            ILinkedMessage[],
            { linkedMessages: ById<INormalizedLinkedMessage>; users: ById<IUser> },
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

      if (!chatOfMessage) {
        const { data } = ChangeSelectedChat.httpRequest.call(
          yield call(() => ChangeSelectedChat.httpRequest.generator({ chatId })),
        );

        if (data) {
          const {
            entities: { chats, users },
          } = normalize<IChat[], { chats?: ById<INormalizedChat>; users: ById<IUser> }, number[]>(
            data,
            chatNormalizationSchema,
          );

          const modeledChat = modelChatList(chats)[data.id];

          if (modeledChat) {
            yield put(UnshiftChat.action({ chat: modeledChat, addToList: true }));
            yield put(AddOrUpdateUsers.action({ users }));
          }

          chatOfMessage = data;
        }
      }

      yield put(MessageCreatedEventHandlerSuccess.action({ linkedMessage, ...payload }));

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
            const httpRequestPayload: IMarkMessagesAsReadApiRequest = {
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
    return httpRequestFactory<AxiosResponse<IMessage>, IGetMessageByIdApiRequest>(
      ({ messageId }: IGetMessageByIdApiRequest) =>
        replaceInUrl(MAIN_API.MESSAGE_CREATED_EVENT, ['messageId', messageId]),
      HttpRequestMethod.Get,
    );
  }
}
