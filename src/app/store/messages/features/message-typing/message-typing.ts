import { httpRequestFactory, HttpRequestMethod } from 'app/store/common/http-factory';
import { ApiBasePath } from 'app/store/root-api';
import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { UserMessageTypingRequest } from '../../models';

export class MessageTyping {
  static get action() {
    return createAction('NOTIFY_USER_ABOUT_MESSAGE_TYPING')<UserMessageTypingRequest>();
  }

  static get saga() {
    return function* ({ payload }: ReturnType<typeof MessageTyping.action>): SagaIterator {
      MessageTyping.httpRequest.call(yield call(() => MessageTyping.httpRequest.generator(payload)));
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse, UserMessageTypingRequest>(
      `${ApiBasePath.NotificationsApi}/api/message/notify-interlocutor-about-message-typing`,
      HttpRequestMethod.Post,
    );
  }
}
