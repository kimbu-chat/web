import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { select, put, call } from 'redux-saga/effects';

import { httpRequestFactory } from '@store/common/http/http-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { myIdSelector } from '../../../my-profile/selectors';

import { resetPeerConnection } from '../../../middlewares/webRTC/reset-peer-connection';
import { getCallInterlocutorSelector, getIsActiveCallIncomingSelector } from '../../selectors';
import { ICallEndedIntegrationEvent } from './call-ended-integration-event';
import { ICall } from '../../common/models';
import { IGetCallByIdApiRequest } from './api-requests/get-call-by-id-api-request';
import { CallEndedEventHandlerSuccess } from './call-ended-event-handler-success';

export class CallEndedEventHandler {
  static get action() {
    return createAction('CallEnded')<ICallEndedIntegrationEvent>();
  }

  static get saga() {
    return function* callEndedSaga(action: ReturnType<typeof CallEndedEventHandler.action>): SagaIterator {
      const { userInterlocutorId, id, startDateTime, endDateTime, creationDateTime, status } = action.payload;
      const interlocutor = yield select(getCallInterlocutorSelector);

      if (!interlocutor || userInterlocutorId === interlocutor?.id) {
        resetPeerConnection();

        let activeCall: ICall | null = null;

        if (interlocutor) {
          const isActiveCallIncoming = yield select(getIsActiveCallIncomingSelector);
          const myId = yield select(myIdSelector);

          activeCall = {
            id,
            userInterlocutor: interlocutor,
            userCallerId: isActiveCallIncoming ? interlocutor.id : myId,
            startDateTime,
            endDateTime,
            status,
            creationDateTime,
          };
        } else {
          const { data } = CallEndedEventHandler.httpRequest.call(yield call(() => CallEndedEventHandler.httpRequest.generator({ callId: id })));

          activeCall = data;
        }

        yield put(CallEndedEventHandlerSuccess.action(activeCall));
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICall>, IGetCallByIdApiRequest>(
      ({ callId }: IGetCallByIdApiRequest) => `${process.env.MAIN_API}/api/calls/${callId}`,
      HttpRequestMethod.Get,
    );
  }
}
