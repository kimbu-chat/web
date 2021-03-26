import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { apply } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import { setInterlocutorOffer } from '../../../middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../calls-state';
import { IIncomingCallIntegrationEvent } from './incoming-call-integration-event';

export class IncomingCallEventHandler {
  static get action() {
    return createAction('CallOfferSent')<IIncomingCallIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof IncomingCallEventHandler.action>) => {
      draft.isIncomingCallVideoEnbaled = payload.isVideoEnabled;
      const interlocutor = payload.userInterlocutor;
      draft.interlocutor = interlocutor;
      draft.amICalled = true;

      return draft;
    });
  }

  static get saga() {
    return function* incomingCallSaga(action: ReturnType<typeof IncomingCallEventHandler.action>): SagaIterator {
      yield apply(setInterlocutorOffer, setInterlocutorOffer, [action.payload.offer]);
    };
  }
}
