import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import produce from 'immer';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { createEmptyDefferedAction } from '@store/common/actions';
import { HTTPStatusCode } from '../../../../common/http-status-code';
import { getSelectedChatIdSelector } from '../../selectors';
import { ChatId } from '../../chat-id';
import { LeaveGroupChatSuccess } from './leave-group-chat-success';
import { ILeaveGroupChatApiRequest } from './api-requests/leave-group-chat-api-request';
import { IChatsState } from '../../chats-state';

export class LeaveGroupChat {
  static get action() {
    return createEmptyDefferedAction('LEAVE_SELECTED_GROUP_CHAT');
  }

  // TODO: handle loading
  static get reducer() {
    return produce((draft: IChatsState) => draft);
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
