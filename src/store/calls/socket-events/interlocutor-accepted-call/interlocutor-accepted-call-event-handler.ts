import produce from 'immer';
import { SagaIterator } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { createAction } from 'typesafe-actions';

import { myIdSelector } from '@store/my-profile/selectors';

import { getPeerConnection } from '../../../middlewares/webRTC/peerConnectionFactory';
import { ICallsState } from '../../calls-state';
import {
  doIhaveCallSelector,
  getIsAcceptCallPendingSelector,
  getIsActiveCallIncomingSelector,
} from '../../selectors';
import { setIsRenegotiationAccepted } from '../../utils/glare-utils';

import { IInterlocutorAcceptedCallIntegrationEvent } from './interlocutor-accepted-call-integration-event';

export class InterlocutorAcceptedCallEventHandler {
  static get action() {
    return createAction('CallAccepted')<IInterlocutorAcceptedCallIntegrationEvent>();
  }

  static get reducer() {
    return produce(
      (
        draft: ICallsState,
        { payload }: ReturnType<typeof InterlocutorAcceptedCallEventHandler.action>,
      ) => {
        if (
          (payload.answer && draft.amICalling) ||
          (draft.amICalled && draft.isActiveCallIncoming)
        ) {
          draft.isSpeaking = true;
          draft.amICalled = false;
          draft.amICalling = false;
        } else if (!(draft.isSpeaking || draft.isAcceptPending)) {
          draft.interlocutorId = undefined;
          draft.isInterlocutorBusy = false;
          draft.amICalling = false;
          draft.amICalled = false;
          draft.isSpeaking = false;
          draft.isInterlocutorVideoEnabled = false;
          draft.videoConstraints.isOpened = false;
          draft.videoConstraints.isOpened = false;
          draft.isScreenSharingOpened = false;
        }

        return draft;
      },
    );
  }

  static get saga() {
    return function* callAcceptedSaga(
      action: ReturnType<typeof InterlocutorAcceptedCallEventHandler.action>,
    ): SagaIterator {
      const callActive = yield select(doIhaveCallSelector);
      const peerConnection = getPeerConnection();
      const myId = yield select(myIdSelector);
      const activeCallIncoming = yield select(getIsActiveCallIncomingSelector);
      const acceptPending = yield select(getIsAcceptCallPendingSelector);

      if (
        !(activeCallIncoming || acceptPending) &&
        action.payload.userInterlocutorId !== myId &&
        callActive
      ) {
        setIsRenegotiationAccepted(true);
        yield call(async () => peerConnection?.setRemoteDescription(action.payload.answer));
      }
    };
  }
}
