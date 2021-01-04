import { HTTPStatusCode } from 'app/common/http-status-code';
import { createEmptyAction } from 'app/store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';

import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { getSelectedChatIdSelector } from '../../selectors';
import { ChatId } from '../../chat-id';
import { LeaveGroupChatSuccess } from './leave-group-chat-success';

export class LeaveGroupChat {
  static get action() {
    return createEmptyAction('LEAVE_SELECTED_GROUP_CHAT');
  }

  static get saga() {
    return function* leaveGroupChatSaga(): SagaIterator {
      try {
        const chatId = yield select(getSelectedChatIdSelector);
        const { groupChatId } = ChatId.fromId(chatId);

        if (groupChatId) {
          const { status } = LeaveGroupChat.httpRequest.call(yield call(() => LeaveGroupChat.httpRequest.generator(groupChatId)));

          if (status === HTTPStatusCode.OK) {
            yield put(LeaveGroupChatSuccess.action({ chatId }));
          } else {
            alert(`Error. http status is ${status}`);
          }
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
