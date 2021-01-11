import { getCallInterlocutorSelector, getIsActiveCallIncomingSelector } from 'store/calls/selectors';
import { resetPeerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { httpRequestFactory } from 'app/store/common/http-factory';
import { HttpRequestMethod } from 'app/store/models';
import { RootState } from 'app/store/root-reducer';
import { UpdateStore } from 'app/store/update-store';
import { AxiosResponse } from 'axios';
import { select, put, call } from 'redux-saga/effects';

import { getMyIdSelector } from 'store/my-profile/selectors';
import { ICallEndedIntegrationEvent } from './call-ended-integration-event';
import { ICall } from '../../models';
import { IGetCallByIdApiRequest } from './api-requests/get-call-by-id-api-request';

export class CallEndedEventHandler {
  static get action() {
    return createAction('CallEnded')<ICallEndedIntegrationEvent>();
  }

  static get saga() {
    return function* (action: ReturnType<typeof CallEndedEventHandler.action>): SagaIterator {
      const { userInterlocutorId, id, duration, status } = action.payload;
      const interlocutor = yield select(getCallInterlocutorSelector);

      if (!interlocutor || userInterlocutorId === interlocutor?.id) {
        resetPeerConnection();

        let activeCall: ICall | null = null;

        if (interlocutor) {
          const isActiveCallIncoming = yield select(getIsActiveCallIncomingSelector);
          const myId = yield select(getMyIdSelector);

          activeCall = {
            id,
            userInterlocutor: interlocutor,
            userCallerId: isActiveCallIncoming ? interlocutor.id : myId,
            duration,
            status,
          };
        } else {
          const { data } = CallEndedEventHandler.httpRequest.call(yield call(() => CallEndedEventHandler.httpRequest.generator({ callId: id })));

          activeCall = data;
        }

        const state: RootState = yield select();

        const nextState = produce(state, (draft) => {
          if (activeCall) {
            draft.calls.calls.calls.unshift(activeCall);
          }

          draft.calls.interlocutor = undefined;
          draft.calls.isInterlocutorBusy = false;
          draft.calls.amICalling = false;
          draft.calls.amICalled = false;
          draft.calls.isSpeaking = false;
          draft.calls.isInterlocutorVideoEnabled = false;
          draft.calls.videoConstraints.isOpened = false;
          draft.calls.videoConstraints.isOpened = false;
          draft.calls.isScreenSharingOpened = false;

          return draft;
        });

        yield put(UpdateStore.action(nextState as RootState));
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
