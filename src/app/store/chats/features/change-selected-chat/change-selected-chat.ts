import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { getChatById, getHasMoreChats } from 'app/store/chats/selectors';
import { getFriendById } from 'app/store/friends/selectors';
import { UserPreview } from '../../../my-profile/models';
import { GetChatsSuccessActionPayload } from '../get-chats/get-chats-success-action-payload';
import { ChatsState, Chat, GetChatByIdRequestData, InterlocutorType, GetUserByIdRequestData } from '../../models';
import { GetChatsSuccess } from '../get-chats/get-chats-success';
import { ChangeSelectedChatActionPayload } from './change-selected-chat-action-payload';
import { ChatId } from '../../chat-id';

export class ChangeSelectedChat {
  static get action() {
    return createAction('CHANGE_SELECTED_CHAT')<ChangeSelectedChatActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof ChangeSelectedChat.action>) => {
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

          const chatIdDetails = ChatId.fromId(action.payload.newChatId);

          let chatList: GetChatsSuccessActionPayload;

          if (chatIdDetails.interlocutorType === InterlocutorType.GROUP_CHAT) {
            const { data, status } = ChangeSelectedChat.httpRequest.getChat.call(
              yield call(() => ChangeSelectedChat.httpRequest.getChat.generator({ chatId: action.payload.newChatId as number })),
            );

            if (status === HTTPStatusCode.OK) {
              chatList = {
                chats: [data],
                hasMore,
                initializedBySearch: false,
              };
              yield put(GetChatsSuccess.action(chatList));
            }
          }

          if (chatIdDetails.interlocutorType === InterlocutorType.USER && chatIdDetails.userId) {
            let interlocutor = yield select(getFriendById(chatIdDetails.userId));

            if (!interlocutor) {
              interlocutor = ChangeSelectedChat.httpRequest.getUser.call(
                yield call(() => ChangeSelectedChat.httpRequest.getUser.generator({ userId: action.payload.newChatId as number })),
              ).data;
            }

            const requestedChat: Chat = {
              id: chatIdDetails.id,
              draftMessage: '',
              interlocutorType: InterlocutorType.USER,
              unreadMessagesCount: 0,
              interlocutorLastReadMessageId: 0,
              interlocutor,
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

            if (interlocutor) {
              chatList = {
                chats: [requestedChat],
                hasMore,
                initializedBySearch: false,
              };
              yield put(GetChatsSuccess.action(chatList));
            }
          }
        } else {
          alert('getChatInfoSaga error');
        }
      }
    };
  }

  static get httpRequest() {
    return {
      getChat: httpRequestFactory<AxiosResponse<Chat>, GetChatByIdRequestData>(
        ({ chatId }: GetChatByIdRequestData) => `${ApiBasePath.MainApi}/api/chats/${chatId}`,
        HttpRequestMethod.Get,
      ),
      getUser: httpRequestFactory<AxiosResponse<UserPreview>, GetUserByIdRequestData>(
        ({ userId }: GetUserByIdRequestData) => `${ApiBasePath.MainApi}/api/users/${userId.toString()}`,
        HttpRequestMethod.Get,
      ),
    };
  }
}
