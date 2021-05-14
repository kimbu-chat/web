import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { MAIN_API } from '@common/paths';
import { Meta } from '@store/common/actions';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector } from '../../selectors';
import { ChatId } from '../../chat-id';

import { IEditGroupChatActionPayload } from './action-payloads/edit-group-chat-action-payload';
import { EditGroupChatSuccess } from './edit-group-chat-success';
import { IEditGroupChatApiRequest } from './api-requests/edit-group-chat-api-request';

export class EditGroupChat {
  static get action() {
    return createAction('EDIT_GROUP_CHAT')<IEditGroupChatActionPayload, Meta>();
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
        action.meta.deferred?.resolve();
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
      MAIN_API.GROUP_CHAT,
      HttpRequestMethod.Put,
    );
  }
}
