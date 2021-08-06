import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { createEmptyDefferedAction } from '@store/common/actions';
import { httpRequestFactory, HttpRequestMethod } from '@store/common/http';
import { replaceInUrl } from '@utils/replace-in-url';

import { HTTPStatusCode } from '../../../../common/http-status-code';
import { ChatId } from '../../chat-id';
import { getSelectedChatIdSelector } from '../../selectors';

import { LeaveGroupChatSuccess } from './leave-group-chat-success';

export class LeaveGroupChat {
  static get action() {
    return createEmptyDefferedAction('LEAVE_SELECTED_GROUP_CHAT');
  }

  static get saga() {
    return function* leaveGroupChatSaga(
      action: ReturnType<typeof LeaveGroupChat.action>,
    ): SagaIterator {
      const chatId = yield select(getSelectedChatIdSelector);
      const { groupChatId } = ChatId.fromId(chatId);

      if (groupChatId) {
        const { status } = LeaveGroupChat.httpRequest.call(
          yield call(() => LeaveGroupChat.httpRequest.generator(groupChatId)),
        );

        if (status === HTTPStatusCode.OK) {
          yield put(LeaveGroupChatSuccess.action({ chatId }));
          action.meta.deferred.resolve();
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, number>(
      (groupChatId: number) =>
        replaceInUrl(MAIN_API.LEAVE_GROUP_CHAT, ['groupChatId', groupChatId]),
      HttpRequestMethod.Delete,
    );
  }
}
