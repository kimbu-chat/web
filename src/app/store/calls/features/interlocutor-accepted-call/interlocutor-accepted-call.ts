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
      console.log(draft.interlocutor?.firstName);

      if (!draft.isSpeaking) {
        if (payload.answer && draft.amICalling) {
          console.log('first instance');
          draft.isSpeaking = true;
          draft.amICalled = false;
          draft.amICalling = false;
          draft.isActiveCallIncoming = false;
          draft.isInterlocutorVideoEnabled = payload.isVideoEnabled;
        } else if (!draft.amICalling) {
          console.log('second instance');
          draft.interlocutor = undefined;
          draft.isInterlocutorBusy = false;
          draft.amICalling = false;
          draft.amICalled = false;
          draft.isSpeaking = false;
          draft.isInterlocutorVideoEnabled = false;
          draft.videoConstraints.isOpened = false;
          draft.videoConstraints.isOpened = false;
          draft.isScreenSharingOpened = false;
        }
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
