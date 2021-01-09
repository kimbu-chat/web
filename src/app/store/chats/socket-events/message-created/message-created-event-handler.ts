import { MyProfileService } from 'app/services/my-profile-service';
import { areNotificationsEnabledSelector } from 'app/store/settings/selectors';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import messageCameSelected from 'app/assets/sounds/notifications/messsage-came-selected.ogg';
import messageCameUnselected from 'app/assets/sounds/notifications/messsage-came-unselected.ogg';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';
import { AxiosResponse } from 'axios';
import { ChangeSelectedChat } from '../../features/change-selected-chat/change-selected-chat';
import { MarkMessagesAsRead } from '../../features/mark-messages-as-read/mark-messages-as-read';
import {
  IChatsState,
  SystemMessageType,
  IChat,
  FileType,
  IAudioAttachment,
  IPictureAttachment,
  IRawAttachment,
  IVideoAttachment,
  IVoiceAttachment,
  IMessage,
} from '../../models';
import { getChatIndexDraftSelector, getSelectedChatIdSelector, getChatByIdSelector, getChatHasMessageWithIdSelector } from '../../selectors';
import { IMessageCreatedIntegrationEvent } from './message-created-integration-event';
import { UnshiftChat } from '../../features/unshift-chat/unshift-chat';
import { IMarkMessagesAsReadApiRequest } from '../../features/mark-messages-as-read/api-requests/mark-messages-as-read-api-request';
import { ChatId } from '../../chat-id';
import { IGetMessageByIdApiRequest } from './api-requests/get-message-by-id-api-request';

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

      if (message.replyToMessageId && !message.replyMessage) {
        const replyMessage = chat.messages.messages.find(({ id }) => id === message.replyToMessageId);

        if (!replyMessage) {
          return draft;
        }

        message.replyMessage = {
          id: replyMessage.id,
          text: replyMessage.text,
          userCreatorFullName: `${replyMessage.userCreator.firstName} ${replyMessage.userCreator.lastName}`,
        };
      }

      // if user already has chats with interlocutor - update chat
      if (chat) {
        const isInterlocutorCurrentSelectedChat = draft.selectedChatId === message.chatId;
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

      if (message.replyToMessageId) {
        const replyingMessageExists = yield select(getChatHasMessageWithIdSelector(message.replyToMessageId, message.chatId));

        if (!replyingMessageExists) {
          const { data: repliedMessage }: AxiosResponse<IMessage> = MessageCreatedEventHandler.httpRequest.call(
            yield call(() => MessageCreatedEventHandler.httpRequest.generator({ messageId: message.replyToMessageId })),
          );

          const replyMessage = {
            id: repliedMessage.id,
            userCreatorFullName: `${repliedMessage.userCreator.firstName} ${repliedMessage.userCreator.lastName}`,
            text: repliedMessage.text,
          };

          yield put(MessageCreatedEventHandler.action({ ...action.payload, replyMessage }));

          return;
        }
      }

      const myId = new MyProfileService().myProfile.id;

      if (selectedChatId === message.chatId) {
        if (!(myId === message.userCreator?.id)) {
          const httpRequestPayload: IMarkMessagesAsReadApiRequest = {
            chatId: selectedChatId,
            lastReadMessageId: message.id,
          };

          MarkMessagesAsRead.httpRequest.call(yield call(() => MarkMessagesAsRead.httpRequest.generator(httpRequestPayload)));
        }
      }
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
          audioSelected.play();
        }

        if (selectedChatId !== message.chatId || document.hidden) {
          const audioUnselected = new Audio(messageCameUnselected);
          audioUnselected.play();
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
