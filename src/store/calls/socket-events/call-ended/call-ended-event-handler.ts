import { createAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ICall, IUser } from 'kimbu-models';
import { normalize } from 'normalizr';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { MAIN_API } from '@common/paths';
import { INormalizedCall } from '@store/calls/common/models';
import { httpRequestFactory } from '@store/common/http/http-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { getUserSelector } from '@store/users/selectors';
import { replaceInUrl } from '@utils/replace-in-url';

import { resetPeerConnection } from '../../../middlewares/webRTC/reset-peer-connection';
import { myIdSelector } from '../../../my-profile/selectors';
import { callNormalizationSchema } from '../../normalization';
import { getCallInterlocutorIdSelector, getIsActiveCallIncomingSelector } from '../../selectors';

import { CallEndedEventHandlerSuccess } from './call-ended-event-handler-success';
import { ICallEndedIntegrationEvent } from './call-ended-integration-event';

export class CallEndedEventHandler {
  static get action() {
    return createAction<ICallEndedIntegrationEvent>('CallEnded');
  }

  static get saga() {
    return function* callEndedSaga(
      action: ReturnType<typeof CallEndedEventHandler.action>,
    ): SagaIterator {
      const { userInterlocutorId, id, startDateTime, endDateTime, creationDateTime, status } =
        action.payload;
      const interlocutorId = yield select(getCallInterlocutorIdSelector);

      if (!interlocutorId || userInterlocutorId === interlocutorId) {
        resetPeerConnection();

        let activeCall: ICall | null = null;

        if (interlocutorId) {
          const isActiveCallIncoming = yield select(getIsActiveCallIncomingSelector);
          const myId = yield select(myIdSelector);
          const userInterlocutor = yield select(getUserSelector(interlocutorId));

          activeCall = {
            id,
            userInterlocutor,
            userCallerId: isActiveCallIncoming ? interlocutorId : myId,
            startDateTime,
            endDateTime,
            status,
            creationDateTime,
          };
        } else {
          const { data } = CallEndedEventHandler.httpRequest.call(
            yield call(() => CallEndedEventHandler.httpRequest.generator(id)),
          );

          activeCall = data;
        }

        const {
          entities: { calls, users },
        } = normalize<ICall[],
          { calls: Record<number, INormalizedCall>; users: Record<number, IUser> },
          number[]>(activeCall, callNormalizationSchema);

        const normalizedCall = calls[activeCall.id];

        if (normalizedCall) {
          yield put(CallEndedEventHandlerSuccess.action(normalizedCall));
          yield put(AddOrUpdateUsers.action({ users }));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICall>, number>(
      (callId: number) => replaceInUrl(MAIN_API.CALL_ENDED_EVENT, ['callId', callId]),
      HttpRequestMethod.Get,
    );
  }
}
