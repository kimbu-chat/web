import { getSelectedChatIdSelector } from 'store/chats/selectors';
import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IEditGroupChatHTTPReqData } from '../../models';
import { IEditGroupChatActionPayload } from './edit-group-chat-action-payload';
import { EditGroupChatSuccess } from './edit-group-chat-success';
import { ChatId } from '../../chat-id';

export class EditGroupChat {
  static get action() {
    return createAction('EDIT_GROUP_CHAT')<IEditGroupChatActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof EditGroupChat.action>): SagaIterator {
      const { name, description, avatar } = action.payload;

      const chatId = yield select(getSelectedChatIdSelector);
      const groupChatId: number = ChatId.fromId(chatId).id;

      const requestData: IEditGroupChatHTTPReqData = {
        id: groupChatId,
        name,
        description,
        avatarId: avatar?.id,
      };

      const { status } = EditGroupChat.httpRequest.call(yield call(() => EditGroupChat.httpRequest.generator(requestData)));

      if (status === HTTPStatusCode.OK) {
        yield put(EditGroupChatSuccess.action({ chatId, name, description, avatar }));
      } else {
        alert('editGroupChat error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IEditGroupChatHTTPReqData>(`${process.env.MAIN_API}/api/group-chats`, HttpRequestMethod.Put);
  }
}
