import { peerConnection } from 'app/store/middlewares/webRTC/peerConnectionFactory';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';
import produce from 'immer';
import { doIhaveCallSelector } from 'app/store/calls/selectors';
import { ICallsState } from '../../calls-state';
import { setIsRenegotiationAccepted } from '../../utils/glare-utils';
import { IInterlocutorAcceptedCallIntegrationEvent } from './interlocutor-accepted-call-integration-event';

export class InterlocutorAcceptedCallEventHandler {
  static get action() {
    return createAction('CallAccepted')<IInterlocutorAcceptedCallIntegrationEvent>();
  }

  static get reducer() {
    return produce((draft: ICallsState, { payload }: ReturnType<typeof InterlocutorAcceptedCallEventHandler.action>) => {
      if (!draft.isSpeaking && !draft.amICalled) {
        if (payload.answer && draft.amICalling) {
          draft.isSpeaking = true;
          draft.amICalled = false;
          draft.amICalling = false;
          draft.isActiveCallIncoming = false;
        } else if (!draft.amICalling) {
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
      } else if (draft.amICalled) {
        draft.isActiveCallIncoming = true;
        draft.isSpeaking = true;
        draft.amICalled = false;
        draft.amICalling = false;
      }

      return draft;
    });
  }

  static get saga() {
    return function* callAcceptedSaga(action: ReturnType<typeof InterlocutorAcceptedCallEventHandler.action>): SagaIterator {
      const callActive = yield select(doIhaveCallSelector);

      if (action.payload.answer && callActive) {
        setIsRenegotiationAccepted(true);
        yield call(async () => await peerConnection?.setRemoteDescription(action.payload.answer));
      }
    };
  }
}
