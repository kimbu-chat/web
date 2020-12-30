import { HTTPStatusCode } from 'app/common/http-status-code';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IEditGroupChatHTTPReqData } from '../../models';
import { IEditGroupChatActionPayload } from './edit-group-chat-action-payload';
import { EditGroupChatSuccess } from './edit-group-chat-success';

export class EditGroupChat {
  static get action() {
    return createAction('EDIT_GROUP_CHAT')<IEditGroupChatActionPayload>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof EditGroupChat.action>): SagaIterator {
      const requestData: IEditGroupChatHTTPReqData = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
        avatarId: action.payload.avatar?.id,
      };

      const { status } = EditGroupChat.httpRequest.call(yield call(() => EditGroupChat.httpRequest.generator(requestData)));

      if (status === HTTPStatusCode.OK) {
        yield put(EditGroupChatSuccess.action(action.payload));
      } else {
        alert('editGroupChat error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, IEditGroupChatHTTPReqData>(`${process.env.MAIN_API}/api/group-chats`, HttpRequestMethod.Put);
  }
}
