import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { doIhaveCall } from 'app/store/calls/selectors';
import { CallState, InterlocutorAcceptedCallActionPayload } from '../../models';

export class InterlocutorAcceptedCall {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL')<InterlocutorAcceptedCallActionPayload>();
  }

  static get reducer() {
    return produce((draft: CallState, { payload }: ReturnType<typeof InterlocutorAcceptedCall.action>) => {
      if (payload.answer && draft.amICalling) {
        draft.isSpeaking = true;
        draft.amICalled = false;
        draft.amICalling = false;

        draft.isActiveCallIncoming = false;
        draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
      }
      return draft;
    });
  }

  static get saga() {
    return function* callAcceptedSaga(action: ReturnType<typeof InterlocutorAcceptedCall.action>): SagaIterator {
      const callActive = yield select(doIhaveCall);

      if (action.payload.answer && callActive) {
        yield call(async () => await peerConnection?.setRemoteDescription(action.payload.answer));
      }
    };
  }
}
