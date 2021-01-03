import { setInterlocutorOffer } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { createAction } from 'typesafe-actions';
import { ICallState } from '../../models';
import { IIncomingCallIntegrationEvent } from './incoming-call-integration-event';

export class IncomingCallEventHandler {
  static get action() {
    return createAction('CallOfferSent')<IIncomingCallIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: ICallState, { payload }: ReturnType<typeof IncomingCallEventHandler.action>) => {
      draft.isIncomingCallVideoEnbaled = payload.isVideoEnabled;
      const interlocutor = payload.userInterlocutor;
      draft.interlocutor = interlocutor;
      draft.amICalled = true;

      return draft;
    });
  }

  static get saga() {
    return function* incomingCallSaga(action: ReturnType<typeof IncomingCallEventHandler.action>): SagaIterator {
      setInterlocutorOffer(action.payload.offer);
    };
  }
}
