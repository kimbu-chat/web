import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put, call, take } from 'redux-saga/effects';
import { createAction, RootState } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { areNotificationsEnabledSelector } from '@store/settings/selectors';
import { UpdateStore } from '@store/update-store';
import { ChangeUserOnlineStatus } from '@store/my-profile/features/change-user-online-status/change-user-online-status';
import {
  setFavicon,
  setNewTitleNotificationInterval,
  getUreadNotifications,
  incrementNotifications,
} from '@utils/set-favicon';
import { playSoundSafely } from '@utils/current-music';
import messageCameUnselected from '../../../../assets/sounds/notifications/messsage-came-unselected.ogg';
import messageCameSelected from '../../../../assets/sounds/notifications/messsage-came-selected.ogg';

import { tabActiveSelector, myIdSelector } from '../../../my-profile/selectors';
import { ChangeSelectedChat } from '../../features/change-selected-chat/change-selected-chat';
import { MarkMessagesAsRead } from '../../features/mark-messages-as-read/mark-messages-as-read';
import {
  SystemMessageType,
  IChat,
  FileType,
  IAudioAttachment,
  IPictureAttachment,
  IVideoAttachment,
  IVoiceAttachment,
  IMessage,
  MessageLinkType,
} from '../../models';
import {
  getChatIndexDraftSelector,
  getSelectedChatIdSelector,
  getChatByIdSelector,
  getChatMessageByIdSelector,
  getChatHasMessageWithIdSelector,
} from '../../selectors';
import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';
import { UnshiftChat } from '../../features/unshift-chat/unshift-chat';
import { IMarkMessagesAsReadApiRequest } from '../../features/mark-messages-as-read/api-requests/mark-messages-as-read-api-request';
import { ChatId } from '../../chat-id';
import { IGetMessageByIdApiRequest } from './api-requests/get-message-by-id-api-request';

export class MessageCreatedEventHandler {
  static get action() {
    return createAction('MessageCreated')<IMessageCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* messageCreatedEventHandler(
      action: ReturnType<typeof MessageCreatedEventHandler.action>,
    ): SagaIterator {
      const {
        attachments,
        chatId,
        creationDateTime,
        id,
        systemMessageType,
        text,
        userCreator,
        linkedMessageId,
        linkedMessageType,
        clientId,
      } = action.payload;

      const messageExists =
        (yield select(getChatHasMessageWithIdSelector(id, chatId))) ||
        (yield select(getChatHasMessageWithIdSelector(clientId, chatId)));

      const isTabActive = yield select(tabActiveSelector);

      const message: IMessage = {
        attachments,
        chatId,
        creationDateTime,
        id,
        systemMessageType,
        text,
        userCreator,
        linkedMessageType,
        isEdited: false,
        isDeleted: false,
      };

      if (messageExists) {
        return;
      }

      const selectedChatId = yield select(getSelectedChatIdSelector);
      const myId = yield select(myIdSelector);

      let linkedMessage: IMessage | null = null;

      if (linkedMessageId && linkedMessageType === MessageLinkType.Reply) {
        linkedMessage = yield select(getChatMessageByIdSelector(linkedMessageId, chatId));
      }

      if (linkedMessageId && !linkedMessage) {
        const { data }: AxiosResponse<IMessage> = MessageCreatedEventHandler.httpRequest.call(
          yield call(() =>
            MessageCreatedEventHandler.httpRequest.generator({ messageId: linkedMessageId }),
          ),
        );

        linkedMessage = data;
      }

      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        const isCurrentUserMessageCreator: boolean = myId === userCreator?.id;

        if (
          systemMessageType === SystemMessageType.GroupChatMemberRemoved &&
          isCurrentUserMessageCreator
        ) {
          return draft;
        }

        const chatIndex = getChatIndexDraftSelector(chatId, draft.chats);
        const chat = draft.chats.chats[chatIndex];

        if (linkedMessage && linkedMessageId) {
          (message as IMessage).linkedMessage = linkedMessage;
        }

        if (chat) {
          const isInterlocutorCurrentSelectedChat = draft.chats.selectedChatId === message.chatId;
          const previousUnreadMessagesCount = chat.unreadMessagesCount;
          const newUnreadMessagesCount =
            isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator
              ? previousUnreadMessagesCount
              : previousUnreadMessagesCount + 1;

          if (
            draft.chats.messages[chatId].messages.findIndex(
              ({ id: messageId }) => messageId === message.id,
            ) === -1
          ) {
            draft.chats.messages[chatId].messages.unshift(message);
          } else {
            return draft;
          }

          attachments?.forEach((attachment) => {
            switch (attachment.type) {
              case FileType.Audio:
                chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 0) + 1;
                chat.audios.audios.unshift({
                  ...(attachment as IAudioAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Picture:
                chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 0) + 1;
                chat.photos.photos.unshift({
                  ...(attachment as IPictureAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Raw:
                chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 0) + 1;
                chat.files.files.unshift({
                  ...attachment,
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Video:
                chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 0) + 1;
                chat.videos.videos.unshift({
                  ...(attachment as IVideoAttachment),
                  creationDateTime: new Date(),
                });

                break;
              case FileType.Voice:
                chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 0) + 1;
                chat.recordings.recordings.unshift({
                  ...(attachment as IVoiceAttachment),
                  creationDateTime: new Date(),
                });

                break;
              default:
                break;
            }
          });

          chat.lastMessage = message;
          chat.unreadMessagesCount = newUnreadMessagesCount;
          chat.draftMessage = '';

          const chatWithNewMessage = chat;

          if (chatIndex !== 0) {
            draft.chats.chats.splice(chatIndex, 1);

            draft.chats.chats.unshift(chatWithNewMessage);
          }
        }

        return draft;
      });

      yield put(UpdateStore.action(nextState as RootState));

      // notifications play
      let chatOfMessage: IChat | undefined = yield select(getChatByIdSelector(message.chatId));
      const isAudioPlayAllowed = yield select(areNotificationsEnabledSelector);
      const unreadNotifications = getUreadNotifications();

      if (!chatOfMessage) {
        const { data } = ChangeSelectedChat.httpRequest.getChat.call(
          yield call(() =>
            ChangeSelectedChat.httpRequest.getChat.generator({ chatId: message.chatId }),
          ),
        );

        if (data) {
          chatOfMessage = data as IChat;

          chatOfMessage.interlocutorType = ChatId.fromId(chatOfMessage.id).interlocutorType;
          chatOfMessage.typingInterlocutors = [];
          chatOfMessage.photos = { photos: [], loading: false, hasMore: true };
          chatOfMessage.videos = { videos: [], loading: false, hasMore: true };
          chatOfMessage.files = { files: [], loading: false, hasMore: true };
          chatOfMessage.audios = { audios: [], loading: false, hasMore: true };
          chatOfMessage.draftMessage = '';
          chatOfMessage.recordings = {
            hasMore: true,
            loading: false,
            recordings: [],
          };
          chatOfMessage.members = { members: [], loading: false, hasMore: true };
          chatOfMessage.unreadMessagesCount = chatOfMessage.unreadMessagesCount || 1;

          yield put(UnshiftChat.action(chatOfMessage));
        }
      }

      if (message.userCreator?.id !== myId) {
        if (chatOfMessage && isAudioPlayAllowed && !chatOfMessage.isMuted) {
          if (!(selectedChatId !== message.chatId) && !document.hidden) {
            const audioSelected = new Audio(messageCameSelected);
            playSoundSafely(audioSelected);
          }

          if (selectedChatId !== message.chatId || document.hidden) {
            const audioUnselected = new Audio(messageCameUnselected);
            playSoundSafely(audioUnselected);
          }
        }

        if (!isTabActive) {
          setFavicon('/favicons/msg-favicon.ico');
          incrementNotifications();

          window.document.title = `${unreadNotifications} unread Notification !`;

          setNewTitleNotificationInterval(() => {
            window.document.title = `${unreadNotifications} unread Notification !`;

            setTimeout(() => {
              window.document.title = 'Ravudi';
            }, 1000);
          });
        }
      }

      if (selectedChatId === message.chatId) {
        if (myId !== message.userCreator?.id) {
          const httpRequestPayload: IMarkMessagesAsReadApiRequest = {
            chatId: selectedChatId,
            lastReadMessageId: message.id,
          };

          if (!isTabActive) {
            yield take(ChangeUserOnlineStatus.action);
          }

          yield call(() => MarkMessagesAsRead.httpRequest.generator(httpRequestPayload));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage>, IGetMessageByIdApiRequest>(
      ({ messageId }: IGetMessageByIdApiRequest) =>
        `${process.env.REACT_APP_MAIN_API}/api/messages/${messageId}`,
      HttpRequestMethod.Get,
    );
  }
}
