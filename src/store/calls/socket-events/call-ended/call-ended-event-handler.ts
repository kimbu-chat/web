import { getUserSelector } from '@store/users/selectors';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { AxiosResponse } from 'axios';
import { select, put, call } from 'redux-saga/effects';

import { httpRequestFactory } from '@store/common/http/http-factory';
import { HttpRequestMethod } from '@store/common/http/http-request-method';
import { replaceInUrl } from '@utils/replace-in-url';
import { MAIN_API } from '@common/paths';
import { normalize } from 'normalizr';
import { IUser } from '@store/common/models';
import { AddOrUpdateUsers } from '@store/users/features/add-or-update-users/add-or-update-users';
import { ById } from '@store/chats/models/by-id';
import { myIdSelector } from '../../../my-profile/selectors';
import { callNormalizationSchema } from '../../normalization';

import { resetPeerConnection } from '../../../middlewares/webRTC/reset-peer-connection';
import { getCallInterlocutorIdSelector, getIsActiveCallIncomingSelector } from '../../selectors';
import { ICallEndedIntegrationEvent } from './call-ended-integration-event';
import { ICall, INormalizedCall } from '../../common/models';
import { IGetCallByIdApiRequest } from './api-requests/get-call-by-id-api-request';
import { CallEndedEventHandlerSuccess } from './call-ended-event-handler-success';

export class CallEndedEventHandler {
  static get action() {
    return createAction('CallEnded')<ICallEndedIntegrationEvent>();
  }

  static get saga() {
    return function* callEndedSaga(
      action: ReturnType<typeof CallEndedEventHandler.action>,
    ): SagaIterator {
      const {
        userInterlocutorId,
        id,
        startDateTime,
        endDateTime,
        creationDateTime,
        status,
      } = action.payload;
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
            yield call(() => CallEndedEventHandler.httpRequest.generator({ callId: id })),
          );

          activeCall = data;
        }

        const {
          entities: { calls, users },
        } = normalize<ICall[], { calls: ById<INormalizedCall>; users: ById<IUser> }, number[]>(
          activeCall,
          callNormalizationSchema,
        );

        if (calls[activeCall.id]) {
          yield put(CallEndedEventHandlerSuccess.action(calls[activeCall.id] as INormalizedCall));
          yield put(AddOrUpdateUsers.action({ users }));
        }
      }
    };
  }

  static get httpRequest() {
    return httpRequestFactory<AxiosResponse<ICall>, IGetCallByIdApiRequest>(
      ({ callId }: IGetCallByIdApiRequest) =>
        replaceInUrl(MAIN_API.CALL_ENDED_EVENT, ['callId', callId]),
      HttpRequestMethod.Get,
    );
  }
}
