import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector } from '../../selectors';
import { IEditGroupChatActionPayload } from './action-payloads/edit-group-chat-action-payload';
import { EditGroupChatSuccess } from './edit-group-chat-success';
import { ChatId } from '../../chat-id';
import { IEditGroupChatApiRequest } from './api-requests/edit-group-chat-api-request';
import { IChatsState } from '../../chats-state';

export class EditGroupChat {
  static get action() {
    return createAction('EDIT_GROUP_CHAT')<IEditGroupChatActionPayload>();
  }

  // TODO: handle loading
  static get reducer() {
    return produce((draft: IChatsState) => draft);
  }

  static get saga() {
    return function* editGroupChat(action: ReturnType<typeof EditGroupChat.action>): SagaIterator {
      const { name, description, avatar } = action.payload;

      const chatId = yield select(getSelectedChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      const requestData: IEditGroupChatApiRequest = {
        id: groupChatId as number,
        name,
        description,
        avatarId: avatar?.id,
      };

      const { status } = EditGroupChat.httpRequest.call(
        yield call(() => EditGroupChat.httpRequest.generator(requestData)),
      );

      if (status === HTTPStatusCode.OK) {
        yield put(
          EditGroupChatSuccess.action({
            chatId,
            name,
            description,
            avatar,
          }),
        );
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IEditGroupChatApiRequest>(
      `${window.__config.REACT_APP_MAIN_API}/api/group-chats`,
      HttpRequestMethod.Put,
    );
  }
}
