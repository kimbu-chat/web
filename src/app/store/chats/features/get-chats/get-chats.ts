import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { AxiosResponse } from 'axios';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { ChatId } from '../../chat-id';
import { IChat, IChatsState, IGetChatsRequestData, InterlocutorType, MessageState } from '../../models';
import { IGetChatsActionPayload } from './get-chats-action-payload';
import { GetChatsSuccess } from './get-chats-success';
import { IGetChatsSuccessActionPayload } from './get-chats-success-action-payload';

export class GetChats {
  static get action() {
    return createAction('GET_CHATS')<IGetChatsActionPayload>();
  }

  static get reducer() {
    return produce((draft: IChatsState, { payload }: ReturnType<typeof GetChats.action>) => ({
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

      const { data }: AxiosResponse<IChat[]> = GetChats.httpRequest.call(yield call(() => GetChats.httpRequest.generator(request)));
      data.forEach((chat: IChat) => {
        if (chat.lastMessage) {
          chat.lastMessage.state =
            chat.interlocutorLastReadMessageId && chat.interlocutorLastReadMessageId >= Number(chat?.lastMessage?.id)
              ? (MessageState.READ as MessageState)
              : (MessageState.SENT as MessageState);
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
        chat.messages = { messages: [], loading: false, hasMore: true };

        if (chat.interlocutorType === InterlocutorType.GroupChat) {
          chat.members = { searchMembers: [], members: [], loading: false, hasMore: true };
        }
      });

      const chatList: IGetChatsSuccessActionPayload = {
        chats: data,
        hasMore: data.length >= action.payload.page.limit,
        initializedBySearch: chatsRequestData.initializedBySearch,
      };

      yield put(GetChatsSuccess.action(chatList));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<IChat[]>, IGetChatsRequestData>(`${process.env.MAIN_API}/api/chats/search`, HttpRequestMethod.Post);
  }
}
