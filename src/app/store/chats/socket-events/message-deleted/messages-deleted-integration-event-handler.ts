import { IMessage } from 'store/chats/models';
import produce from 'immer';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';
import { AxiosResponse } from 'axios';
import { RootState } from 'app/store/root-reducer';
import { UpdateStore } from 'app/store/update-store';
import { SagaIterator } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import { FileType } from '../../models';
import { getChatByIdDraftSelector, getChatLastMessageIdSelector, getChatMessagesLengthSelector } from '../../selectors';
import { IMessagesDeletedIntegrationEvent } from './messages-deleted-integration-event';
import { IGetLastMessageByChatIdApiRequest } from './api-requests/get-last-message-by-chat-id-api-request';

export class MessagesDeletedIntegrationEventHandler {
  static get action() {
    return createAction('MessagesDeleted')<IMessagesDeletedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof MessagesDeletedIntegrationEventHandler.action>): SagaIterator {
      const { chatId, messageIds } = action.payload;
      const lastMessageId = yield select(getChatLastMessageIdSelector(chatId));
      const messageListIsEmpty = (yield select(getChatMessagesLengthSelector(chatId))) === 0;
      let newLastMessage: IMessage;

      console.log(messageIds.includes(lastMessageId));
      console.log(messageListIsEmpty);

      if (messageIds.includes(lastMessageId) && messageListIsEmpty) {
        const { data }: AxiosResponse<IMessage> = MessagesDeletedIntegrationEventHandler.httpRequest.call(
          yield call(() => MessagesDeletedIntegrationEventHandler.httpRequest.generator({ chatId })),
        );

        newLastMessage = data;

        console.log(data);
      }

      const state: RootState = yield select();

      const nextState = produce(state, (draft) => {
        const chat = getChatByIdDraftSelector(chatId, draft.chats);

        if (chat) {
          messageIds.forEach((msgIdToDelete) => {
            draft.chats.selectedMessageIds = draft.chats.selectedMessageIds.filter((id) => id !== msgIdToDelete);
            const messageIndex = draft.chats.messages[chatId].messages.findIndex(({ id }) => id === msgIdToDelete);

            const [deletedMessage] = draft.chats.messages[chatId].messages.splice(messageIndex, 1);

            deletedMessage?.attachments?.forEach((attachment) => {
              switch (attachment.type) {
                case FileType.Audio:
                  chat.audioAttachmentsCount = (chat.audioAttachmentsCount || 1) - 1;
                  chat.audios.audios = chat.audios.audios.filter(({ id }) => id !== attachment.id);

                  break;
                case FileType.Picture:
                  chat.pictureAttachmentsCount = (chat.pictureAttachmentsCount || 1) - 1;
                  chat.photos.photos = chat.photos.photos.filter(({ id }) => id !== attachment.id);

                  break;
                case FileType.Raw:
                  chat.rawAttachmentsCount = (chat.rawAttachmentsCount || 1) - 1;
                  chat.files.files = chat.files.files.filter(({ id }) => id !== attachment.id);

                  break;
                case FileType.Video:
                  chat.videoAttachmentsCount = (chat.videoAttachmentsCount || 1) - 1;
                  chat.videos.videos = chat.videos.videos.filter(({ id }) => id !== attachment.id);

                  break;
                case FileType.Voice:
                  chat.voiceAttachmentsCount = (chat.voiceAttachmentsCount || 1) - 1;
                  chat.recordings.recordings = chat.recordings.recordings.filter(({ id }) => id !== attachment.id);

                  break;
                default:
                  break;
              }
            });

            const linkedMessage = draft.chats.messages[chatId].messages.filter(({ linkedMessage }) => linkedMessage?.id === msgIdToDelete);

            linkedMessage?.forEach((message) => {
              if (message.linkedMessage) {
                message.linkedMessage.isDeleted = true;
              }
            });
          });

          if (chat.lastMessage) {
            if (messageIds.includes(chat.lastMessage.id)) {
              chat.lastMessage = draft.chats.messages[chatId].messages[0] || newLastMessage;
            }
          }

          if (chat.lastMessage?.linkedMessage) {
            if (messageIds.includes(chat.lastMessage?.linkedMessage?.id!)) {
              chat.lastMessage.linkedMessage.isDeleted = true;
            }
          }
        }

        return draft;
      });

      yield put(UpdateStore.action(nextState as RootState));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IMessage>, IGetLastMessageByChatIdApiRequest>(
      ({ chatId }: IGetLastMessageByChatIdApiRequest) => `${process.env.MAIN_API}/api/chats/${chatId}/last-message`,
      HttpRequestMethod.Get,
    );
  }
}
