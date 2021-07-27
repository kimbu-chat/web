import { SagaIterator } from 'redux-saga';
import { select, call } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { deviceIdSelector } from '@store/auth/selectors';

import { Logout } from '../../features/logout/logout';

import { ISessionTerminatedIntegrationEvent } from './session-terminated-event';

export class SessionTerminatedEventHandler {
  static get action() {
    return createAction('SessionTerminated')<ISessionTerminatedIntegrationEvent>();
  }

  static get saga() {
    return function* incomingCallSaga(
      action: ReturnType<typeof SessionTerminatedEventHandler.action>,
    ): SagaIterator {
      const currentDeviceId = yield select(deviceIdSelector);

      if (action.payload.refreshTokenId === Number(currentDeviceId)) {
        yield call(Logout.saga);
      }
    };
  }
}
