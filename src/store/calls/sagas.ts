import { all, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

import { AcceptCall } from './features/accept-call/accept-call';
import { CancelCall } from './features/cancel-call/cancel-call';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { ChangeMediaStatus } from './features/change-user-media-status/change-media-status';
import { DeclineCall } from './features/decline-call/decline-call';
import { SpawnDeviceUpdateWatcher } from './features/device-watcher/spawn-device-update-watcher';
import { EndCall } from './features/end-call/end-call';
import { GetCalls } from './features/get-calls/get-calls';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { SwitchDevice } from './features/switch-device/switch-device';
import { TimeoutCall } from './features/timeout-call/timeout-call';
import { CallEndedEventHandler } from './socket-events/call-ended/call-ended-event-handler';
import { IncomingCallEventHandler } from './socket-events/incoming-call/incoming-call-event-handler';
import { InterlocutorAcceptedCallEventHandler } from './socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { RenegotiationAcceptedEventHandler } from './socket-events/renegotiation-accepted/renegotiation-accepted-event-handler';
import { RenegotiationSentEventHandler } from './socket-events/renegotiation-sent/renegotiation-sent-event-handler';

//! important peer whitch has initiated the call  is the polite one

export function* callsSaga() {
  yield all([
    takeLatest(OutgoingCall.action, OutgoingCall.saga),
    takeLatest(CancelCall.action, CancelCall.saga),
    takeLatest(EndCall.action, EndCall.saga),
    takeLatest(DeclineCall.action, DeclineCall.saga),
    takeLatest(TimeoutCall.action, TimeoutCall.saga),
    takeLatest(AcceptCall.action, AcceptCall.saga),
    takeLatest(ChangeScreenShareStatus.action, ChangeScreenShareStatus.saga),
    takeLatest(SwitchDevice.action, SwitchDevice.saga),
    takeLeading(ChangeMediaStatus.action, ChangeMediaStatus.saga),
    takeLatest(GetCalls.action, GetCalls.saga),
    takeLatest(SpawnDeviceUpdateWatcher.action, SpawnDeviceUpdateWatcher.saga),

    // socket-events
    takeLatest(IncomingCallEventHandler.action, IncomingCallEventHandler.saga),
    takeEvery(RenegotiationSentEventHandler.action, RenegotiationSentEventHandler.saga),
    takeLatest(CallEndedEventHandler.action, CallEndedEventHandler.saga),
    takeEvery(RenegotiationAcceptedEventHandler.action, RenegotiationAcceptedEventHandler.saga),
    takeLatest(
      InterlocutorAcceptedCallEventHandler.action,
      InterlocutorAcceptedCallEventHandler.saga,
    ),
  ]);
}
