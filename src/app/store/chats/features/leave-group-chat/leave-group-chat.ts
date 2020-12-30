import { HTTPStatusCode } from 'app/common/http-status-code';
import { Meta } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { IChat } from '../../models';
import { ILeaveGroupChatActionPayload } from './leave-group-chat-action-payload';
import { LeaveGroupChatSuccess } from './leave-group-chat-success';

export class LeaveGroupChat {
  static get action() {
    return createAction('LEAVE_GROUP_CHAT')<ILeaveGroupChatActionPayload, Meta>();
  }

  static get saga() {
    return function* leaveGroupChatSaga(action: ReturnType<typeof LeaveGroupChat.action>): SagaIterator {
      try {
        const chat: IChat = action.payload;
        const { status } = LeaveGroupChat.httpRequest.call(yield call(() => LeaveGroupChat.httpRequest.generator(chat.groupChat!.id)));
        if (status === HTTPStatusCode.OK) {
          yield put(LeaveGroupChatSuccess.action(action.payload));
          action.meta.deferred?.resolve();
        } else {
          alert(`Error. http status is ${status}`);
        }
      } catch {
        alert('leaveGroupChatSaga error');
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, number>((id: number) => `${process.env.MAIN_API}/api/group-chats/${id}`, HttpRequestMethod.Delete);
  }
}
