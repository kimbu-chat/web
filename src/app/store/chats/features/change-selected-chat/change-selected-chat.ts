import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatByIdSelector, getHasMoreChatsSelector, getChatByIdDraftSelector } from 'app/store/chats/selectors';
import { getFriendByIdSelector } from 'app/store/friends/selectors';
import { IUserPreview } from 'app/store/models';
import { MESSAGES_LIMIT } from 'app/utils/pagination-limits';
import { IGetChatsSuccessActionPayload } from '../get-chats/action-payloads/get-chats-success-action-payload';
import { IChatsState, IChat, InterlocutorType, MessageState } from '../../models';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { IChangeSelectedChatActionPayload } from './action-payloads/change-selected-chat-action-payload';
import { ChatId } from '../../chat-id';
import { IGetChatByIdApiRequest } from './api-requests/get-chat-by-id-api-request';
import { IGetUserByIdApiRequest } from './api-requests/get-user-by-id-api-request';

export class ChangeSelectedChat {
  static get action() {
    return createAction('CHANGE_SELECTED_CHAT')<IChangeSelectedChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeSelectedChat.action>) => {
      const { oldChatId, newChatId } = payload;

      draft.selectedChatId = newChatId;

      if (oldChatId) {
        const chat = getChatByIdDraftSelector(oldChatId, draft);

        if (chat && chat.messages.messages.length > MESSAGES_LIMIT) {
          chat.messages.messages = chat.messages.messages.slice(0, 30);
        }

        if (chat && draft.selectedMessageIds.length > 0) {
          chat.messages.messages.map((message) => {
            message.isSelected = false;
            return message;
          });
        }
      }

      draft.selectedMessageIds = [];

      draft.messageToReply = undefined;
      draft.messageToEdit = undefined;

      return draft;
    });
  }

  static get saga() {
    return function* changeSelectedChatSaga(action: ReturnType<typeof ChangeSelectedChat.action>): SagaIterator {
      if (action.payload.newChatId !== null && !Number.isNaN(action.payload.newChatId)) {
        const chatExists = (yield select(getChatByIdSelector(action.payload.newChatId))) !== undefined;

        if (!chatExists) {
          const hasMore = yield select(getHasMoreChatsSelector);

          const chatIdDetails = action.payload.newChatId ? ChatId.fromId(action.payload.newChatId) : null;

          let chatList: IGetChatsSuccessActionPayload;

          let data: IChat | null = null;
          let user: IUserPreview | null = null;

          try {
            data = ChangeSelectedChat.httpRequest.getChat.call(
              yield call(() => ChangeSelectedChat.httpRequest.getChat.generator({ chatId: action.payload.newChatId as number })),
            ).data;
          } catch {
            if (chatIdDetails?.interlocutorType === InterlocutorType.User) {
              user = ChangeSelectedChat.httpRequest.getUser.call(
                yield call(() => ChangeSelectedChat.httpRequest.getUser.generator({ userId: chatIdDetails?.userId as number })),
              ).data;
            }
          }

          if (chatIdDetails?.interlocutorType === InterlocutorType.GroupChat) {
            if (data) {
              const chat = data as IChat;

              if (chat.lastMessage) {
                chat.lastMessage.state =
                  chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= Number(chat?.lastMessage?.id)
                    ? MessageState.READ
                    : MessageState.SENT;
              }

              chat.interlocutorType = ChatId.fromId(chat.id).interlocutorType;
              chat.typingInterlocutors = [];
              chat.photos = { photos: [], loading: false, hasMore: true };
              chat.videos = { videos: [], loading: false, hasMore: true };
              chat.files = { files: [], loading: false, hasMore: true };
              chat.audios = { audios: [], loading: false, hasMore: true };
              chat.draftMessage = '';
              chat.recordings = {
                hasMore: true,
                loading: false,
                recordings: [],
              };
              chat.members = { members: [], loading: false, hasMore: true };
              chat.messages = {
                messages: [],
                hasMore: true,
                loading: false,
              };

              chatList = {
                chats: [chat],
                hasMore,
                initializedBySearch: false,
              };
              yield put(GetChatsSuccess.action(chatList));
            }
          }

          if (chatIdDetails?.interlocutorType === InterlocutorType.User && chatIdDetails?.userId) {
            if (!(data || user)) {
              user = yield select(getFriendByIdSelector(chatIdDetails.userId));
            }

            if (data || user) {
              const requestedChat: IChat = {
                id: chatIdDetails!.id,
                draftMessage: '',
                lastMessage: data?.lastMessage,
                isMuted: data?.isMuted || false,
                interlocutorType: InterlocutorType.User,
                unreadMessagesCount: data?.unreadMessagesCount || 0,
                interlocutorLastReadMessageId: data?.interlocutorLastReadMessageId || 0,
                interlocutor: (data?.interlocutor || user) as IUserPreview,
                typingInterlocutors: [],
                photos: {
                  hasMore: true,
                  loading: false,
                  photos: [],
                },
                videos: {
                  hasMore: true,
                  loading: false,
                  videos: [],
                },
                files: {
                  hasMore: true,
                  loading: false,
                  files: [],
                },
                members: {
                  hasMore: true,
                  loading: false,
                  members: [],
                },
                recordings: {
                  hasMore: true,
                  loading: false,
                  recordings: [],
                },
                audios: {
                  hasMore: true,
                  loading: false,
                  audios: [],
                },
                messages: {
                  messages: [],
                  hasMore: true,
                  loading: false,
                },
              };

              if (requestedChat.lastMessage) {
                requestedChat.lastMessage.state =
                  requestedChat.interlocutorLastReadMessageId && requestedChat.interlocutorLastReadMessageId >= Number(requestedChat?.lastMessage?.id)
                    ? MessageState.READ
                    : MessageState.SENT;
              }

              chatList = {
                chats: [requestedChat],
                hasMore,
                initializedBySearch: false,
              };
              yield put(GetChatsSuccess.action(chatList));
            }
          }
        }
      }
    };
  }

  static get httpRequest() {
    return {
      getChat: httpRequestFactory<AxiosResponse<IChat>, IGetChatByIdApiRequest>(
        ({ chatId }: IGetChatByIdApiRequest) => `${process.env.MAIN_API}/api/chats/${chatId}`,
        HttpRequestMethod.Get,
      ),
      getUser: httpRequestFactory<AxiosResponse<IUserPreview>, IGetUserByIdApiRequest>(
        ({ userId }: IGetUserByIdApiRequest) => `${process.env.MAIN_API}/api/users/${userId.toString()}`,
        HttpRequestMethod.Get,
      ),
    };
  }
}
