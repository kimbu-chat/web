import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatById, getHasMoreChats } from 'app/store/chats/selectors';
import { getFriendById } from 'app/store/friends/selectors';
import { MessageState } from 'app/store/messages/models';
import { IUserPreview } from 'store/my-profile/models';
import { IGetChatsSuccessActionPayload } from '../get-chats/get-chats-success-action-payload';
import { IChatsState, IChat, IGetChatByIdRequestData, InterlocutorType, IGetUserByIdRequestData } from '../../models';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { IChangeSelectedChatActionPayload } from './change-selected-chat-action-payload';
import { ChatId } from '../../chat-id';

export class ChangeSelectedChat {
  static get action() {
    return createAction('CHANGE_SELECTED_CHAT')<IChangeSelectedChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof ChangeSelectedChat.action>) => {
      draft.chats.sort(
        ({ lastMessage: lastMessageA }, { lastMessage: lastMessageB }) =>
          new Date(lastMessageB?.creationDateTime!).getTime() - new Date(lastMessageA?.creationDateTime!).getTime(),
      );

      console.log(payload);

      draft.selectedChatId = payload.newChatId;

      return draft;
    });
  }

  static get saga() {
    return function* changeSelectedChatSaga(action: ReturnType<typeof ChangeSelectedChat.action>): SagaIterator {
      if (action.payload.newChatId !== null && !Number.isNaN(action.payload)) {
        const chatExists = (yield select(getChatById(action.payload.newChatId))) !== undefined;

        if (!chatExists) {
          const hasMore = yield select(getHasMoreChats);

          const chatIdDetails = action.payload.newChatId ? ChatId.fromId(action.payload.newChatId) : null;

          let chatList: IGetChatsSuccessActionPayload;

          let data: IChat | null = null;
          let user: IUserPreview | null = null;

          try {
            data = ChangeSelectedChat.httpRequest.getChat.call(
              yield call(() => ChangeSelectedChat.httpRequest.getChat.generator({ chatId: action.payload.newChatId as number })),
            ).data;
          } catch {
            user = ChangeSelectedChat.httpRequest.getUser.call(
              yield call(() => ChangeSelectedChat.httpRequest.getUser.generator({ userId: action.payload.newChatId as number })),
            ).data;
          }

          if (chatIdDetails?.interlocutorType === InterlocutorType.GROUP_CHAT) {
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
              chat.members = { searchMembers: [], members: [], loading: false, hasMore: true };

              chatList = {
                chats: [chat],
                hasMore,
                initializedBySearch: false,
              };
              yield put(GetChatsSuccess.action(chatList));
            }
          }

          if (chatIdDetails?.interlocutorType === InterlocutorType.USER && chatIdDetails?.userId) {
            if (!(data || user)) {
              user = yield select(getFriendById(chatIdDetails.userId));
            }

            if (data || user) {
              const requestedChat: IChat = {
                id: chatIdDetails!.id,
                draftMessage: '',
                lastMessage: data?.lastMessage,
                isMuted: data?.isMuted || false,
                interlocutorType: InterlocutorType.USER,
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
                  searchMembers: [],
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
      getChat: httpRequestFactory<AxiosResponse<IChat>, IGetChatByIdRequestData>(
        ({ chatId }: IGetChatByIdRequestData) => `${ApiBasePath.MainApi}/api/chats/${chatId}`,
        HttpRequestMethod.Get,
      ),
      getUser: httpRequestFactory<AxiosResponse<IUserPreview>, IGetUserByIdRequestData>(
        ({ userId }: IGetUserByIdRequestData) => `${ApiBasePath.MainApi}/api/users/${userId.toString()}`,
        HttpRequestMethod.Get,
      ),
    };
  }
}
