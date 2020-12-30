import { setInterlocutorOffer } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { ICallState } from '../../models';
import { IncomingCallActionPayload } from './incoming-call-action-payload';

export class IncomingCall {
  static get action() {
    return createAction('INCOMING_CALL')<IncomingCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: ICallState, { payload }: ReturnType<typeof IncomingCall.action>) => {
      draft.isIncomingCallVideoEnbaled = payload.isVideoEnabled;
      const interlocutor = payload.userInterlocutor;
      draft.interlocutor = interlocutor;
      draft.amICalled = true;

      return draft;
    });
  }

  static get saga() {
    return function* incomingCallSaga(action: ReturnType<typeof IncomingCall.action>): SagaIterator {
      setInterlocutorOffer(action.payload.offer);
    };
  }
}
