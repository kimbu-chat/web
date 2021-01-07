import { HTTPStatusCode } from 'app/common/http-status-code';
import { createEmptyDefferedAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { getSelectedChatIdSelector } from '../../selectors';
import { ChatId } from '../../chat-id';
import { LeaveGroupChatSuccess } from './leave-group-chat-success';
import { ILeaveGroupChatApiRequest } from './api-requests/leave-group-chat-api-request';

export class LeaveGroupChat {
  static get action() {
    return createEmptyDefferedAction('LEAVE_SELECTED_GROUP_CHAT');
  }

  static get saga() {
    return function* leaveGroupChatSaga(action: ReturnType<typeof LeaveGroupChat.action>): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      if (groupChatId) {
        const { status } = LeaveGroupChat.httpRequest.call(yield call(() => LeaveGroupChat.httpRequest.generator({ groupChatId })));

        if (status === HTTPStatusCode.OK) {
          yield put(LeaveGroupChatSuccess.action({ chatId }));
          action.meta.deferred.resolve();
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, ILeaveGroupChatApiRequest>(
      ({ groupChatId }: ILeaveGroupChatApiRequest) => `${process.env.MAIN_API}/api/group-chats/${groupChatId}`,
      HttpRequestMethod.Delete,
    );
  }
}
