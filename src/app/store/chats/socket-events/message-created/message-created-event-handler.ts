import { UpdateStore } from 'app/store/update-store';
import { areNotificationsEnabledSelector } from 'app/store/settings/selectors';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put, call, take } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';
import { AxiosResponse } from 'axios';
import { RootState } from 'app/store/root-reducer';
import { playSoundSafely } from 'app/utils/current-music';
import { resetFavicons, setFavicon } from 'app/utils/set-favicon';
import { ChangeUserOnlineStatus } from '../../../my-profile/features/change-user-online-status/change-user-online-status';
import { getIsTabActiveSelector, getMyIdSelector } from '../../../my-profile/selectors';
import { ChangeSelectedChat } from '../../features/change-selected-chat/change-selected-chat';
import { MarkMessagesAsRead } from '../../features/mark-messages-as-read/mark-messages-as-read';
import {
  SystemMessageType,
  IChat,
  FileType,
  IAudioAttachment,
  IPictureAttachment,
  IRawAttachment,
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

let unreadNotifications = 0;
let windowNotificationIntervalCode: NodeJS.Timeout;

export const resetUnreadNotifications = () => {
  unreadNotifications = 0;

  if (windowNotificationIntervalCode) {
    clearInterval(windowNotificationIntervalCode);
  }

  resetFavicons();
};

export const setNewTitleNotificationInterval = (callback: () => void) => {
  if (windowNotificationIntervalCode) {
    clearInterval(windowNotificationIntervalCode);
  }

  windowNotificationIntervalCode = (setInterval(callback, 2000) as unknown) as NodeJS.Timeout;
};

export class MessageCreatedEventHandler {
  static get action() {
    return createAction('MessageCreated')<IMessageCreatedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MessageCreatedEventHandler.action>): SagaIterator {
      const message = action.payload;

      const messageExists = yield select(getChatHasMessageWithIdSelector(message.id, message.chatId));
      const isTabActive = yield select(getIsTabActiveSelector);

      if (messageExists) {
        return;
      }

      const selectedChatId = yield select(getSelectedChatIdSelector);
      const myId = yield select(getMyIdSelector);

      let linkedMessage: IMessage | null = null;

      if (message.linkedMessageId && message.linkedMessageType === MessageLinkType.Reply) {
        linkedMessage = yield select(getChatMessageByIdSelector(message.linkedMessageId, message.chatId));
      }

      if (message.linkedMessageId && !linkedMessage) {
        const { data }: AxiosResponse<IMessage> = MessageCreatedEventHandler.httpRequest.call(
          yield call(() => MessageCreatedEventHandler.httpRequest.generator({ messageId: message.linkedMessageId })),
        );

        linkedMessage = data;
      }

      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        const isCurrentUserMessageCreator: boolean = myId === message.userCreator?.id;

        if (message.systemMessageType === SystemMessageType.GroupChatMemberRemoved && isCurrentUserMessageCreator) {
          return draft;
        }

        const chatIndex = getChatIndexDraftSelector(message.chatId, draft.chats);
        const chat = draft.chats.chats[chatIndex];

        if (message.linkedMessageId) {
          (message as IMessage).linkedMessage = linkedMessage!;
        }

        if (chat) {
          const isInterlocutorCurrentSelectedChat = draft.chats.selectedChatId === message.chatId;
          const previousUnreadMessagesCount = chat.unreadMessagesCount;
          const newUnreadMessagesCount =
            isInterlocutorCurrentSelectedChat || isCurrentUserMessageCreator ? previousUnreadMessagesCount : previousUnreadMessagesCount + 1;

          if (chat.messages.messages.findIndex(({ id }) => id === message.id) === -1) {
            chat.messages.messages.unshift(message);
          } else {
            return draft;
          }

          message.attachments?.forEach((attachment) => {
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
                  ...(attachment as IRawAttachment),
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

      if (!chatOfMessage) {
        const { data } = ChangeSelectedChat.httpRequest.getChat.call(
          yield call(() => ChangeSelectedChat.httpRequest.getChat.generator({ chatId: message.chatId })),
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
          chatOfMessage.messages = {
            messages: [],
            hasMore: true,
            loading: false,
          };
          chatOfMessage.unreadMessagesCount = chatOfMessage.unreadMessagesCount || 1;

          yield put(UnshiftChat.action(chatOfMessage));
        }
      }

      if (isAudioPlayAllowed && !chatOfMessage!.isMuted && message.userCreator?.id !== myId) {
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
        unreadNotifications += 1;

        window.document.title = `${unreadNotifications} unread Notification !`;

        setNewTitleNotificationInterval(() => {
          window.document.title = `${unreadNotifications} unread Notification !`;

          setTimeout(() => {
            window.document.title = 'Kimbu';
          }, 1000);
        });
      }

      if (selectedChatId === message.chatId) {
        if (!(myId === message.userCreator?.id)) {
          const httpRequestPayload: IMarkMessagesAsReadApiRequest = {
            chatId: selectedChatId,
            lastReadMessageId: message.id,
          };

          if (!isTabActive) {
            yield take(ChangeUserOnlineStatus.action);
          }

          MarkMessagesAsRead.httpRequest.call(yield call(() => MarkMessagesAsRead.httpRequest.generator(httpRequestPayload)));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage>, IGetMessageByIdApiRequest>(
      ({ messageId }: IGetMessageByIdApiRequest) => `${process.env.MAIN_API}/api/messages/${messageId}`,
      HttpRequestMethod.Get,
    );
  }
}
