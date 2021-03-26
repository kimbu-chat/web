import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';
import { EndCall } from './features/end-call/end-call';
import { CancelCall } from './features/cancel-call/cancel-call';
import { AcceptCall } from './features/accept-call/accept-call';
import { GetCalls } from './features/get-calls/get-calls';
import { DeclineCall } from './features/decline-call/decline-call';
import { InterlocutorAcceptedCallEventHandler } from './socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { TimeoutCall } from './features/timeout-call/timeout-call';
import { CallEndedEventHandler } from './socket-events/call-ended/call-ended-event-handler';
import { IceCandidateSentEventHandler } from './socket-events/ice-candidate-sent/ice-candidate-sent-event-handler';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { SwitchDevice } from './features/switch-device/switch-device';
import { ChangeMediaStatus } from './features/change-user-media-status/change-media-status';
import { IncomingCallEventHandler } from './socket-events/incoming-call/incoming-call-event-handler';
import { RenegotiationSentEventHandler } from './socket-events/renegotiation-sent/renegotiation-sent-event-handler';
import { RenegotiationAcceptedEventHandler } from './socket-events/renegotiation-accepted/renegotiation-accepted-event-handler';

//! important peer whitch has initiated the call  is the polite one

export const CallsSagas = [
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

  // socket-events
  takeLatest(IncomingCallEventHandler.action, IncomingCallEventHandler.saga),
  takeEvery(RenegotiationSentEventHandler.action, RenegotiationSentEventHandler.saga),
  takeLatest(CallEndedEventHandler.action, CallEndedEventHandler.saga),
  takeEvery(RenegotiationAcceptedEventHandler.action, RenegotiationAcceptedEventHandler.saga),
  takeLatest(
    InterlocutorAcceptedCallEventHandler.action,
    InterlocutorAcceptedCallEventHandler.saga,
  ),
  takeEvery(IceCandidateSentEventHandler.action, IceCandidateSentEventHandler.saga),
];
