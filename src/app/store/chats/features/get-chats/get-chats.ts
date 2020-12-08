import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { MessageState } from 'app/store/messages/models';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { ChatsState, Chat, GetChatsRequestData } from '../../models';
import { GetChatsActionPayload } from './get-chats-action-payload';
import { GetChatsSuccess } from './get-chats-success';
import { GetChatsSuccessActionPayload } from './get-chats-success-action-payload';

export class GetChats {
  static get action() {
    return createAction('GET_CHATS')<GetChatsActionPayload>();
  }

  static get reducer() {
    return produce((draft: ChatsState, { payload }: ReturnType<typeof GetChats.action>) => ({
      ...draft,
      loading: true,
      searchString: payload.name || '',
    }));
  }

  static get saga() {
    return function* (action: ReturnType<typeof GetChats.action>): SagaIterator {
      const chatsRequestData = action.payload;

      const { name, showOnlyHidden, page, showAll } = action.payload;

      const request = {
        name,
        showOnlyHidden,
        page,
        showAll,
      };

      const { data }: AxiosResponse<Chat[]> = GetChats.httpRequest.call(yield call(() => GetChats.httpRequest.generator(request)));
      data.forEach((chat: Chat) => {
        const lastMessage = chat.lastMessage || { state: {} };

        lastMessage.state =
          chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= Number(chat?.lastMessage?.id)
            ? (MessageState.READ as MessageState)
            : (MessageState.SENT as MessageState);
        chat.interlocutorType = new ChatId().From(chat.id).interlocutorType;
        chat.id = new ChatId().From(chat.interlocutor?.id, chat.groupChat?.id).entireId;
        chat.typingInterlocutors = [];
        chat.photos = { photos: [], hasMore: true };
        chat.videos = { videos: [], hasMore: true };
        chat.files = { files: [], hasMore: true };
        chat.audios = { audios: [], hasMore: true };
        chat.draftMessage = '';
        chat.recordings = {
          hasMore: true,
          recordings: [],
        };
      });

      const chatList: GetChatsSuccessActionPayload = {
        chats: data,
        hasMore: data.length >= action.payload.page.limit,
        initializedBySearch: chatsRequestData.initializedBySearch,
      };

      yield put(GetChatsSuccess.action(chatList));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<Chat[]>, GetChatsRequestData>(`${ApiBasePath.MainApi}/api/chats/search`, HttpRequestMethod.Post);
  }
}
