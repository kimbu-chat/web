import { takeLatest, takeEvery } from 'redux-saga/effects';
import { AcceptCall } from './features/accept-call/accept-call';
import { CallEnded } from './features/call-ended/call-ended';
import { CancelCall } from './features/cancel-call/cancel-call';
import { Candidate } from './features/candidate/candidate';
import { ChangeMediaStatus } from './features/change-media-status/change-media-status';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { DeclineCall } from './features/decline-call/decline-call';
import { EndCall } from './features/end-call/end-call';
import { GetCalls } from './features/get-calls/get-calls';
import { IncomingCall } from './features/incoming-call/incoming-call';
import { InterlocutorAcceptedCall } from './features/interlocutor-accepted-call/interlocutor-accepted-call';
import { InterlocutorCanceledCall } from './features/interlocutor-canceled-call/interlocutor-canceled-call';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { SwitchDevice } from './features/switch-device/switch-device';
import { TimeoutCall } from './features/timeout-call/timeout-call';

export const CallsSagas = [
  takeLatest(OutgoingCall.action, OutgoingCall.saga),
  takeLatest(CancelCall.action, CancelCall.saga),
  takeLatest(EndCall.action, EndCall.saga),
  takeLatest(DeclineCall.action, DeclineCall.saga),
  takeLatest(TimeoutCall.action, TimeoutCall.saga),
  takeLatest(AcceptCall.action, AcceptCall.saga),
  takeLatest(InterlocutorAcceptedCall.action, InterlocutorAcceptedCall.saga),
  takeEvery(Candidate.action, Candidate.saga),
  takeLatest(InterlocutorCanceledCall.action, InterlocutorCanceledCall.saga),
  takeLatest(CallEnded.action, CallEnded.saga),
  takeLatest(ChangeScreenShareStatus.action, ChangeScreenShareStatus.saga),
  takeLatest(SwitchDevice.action, SwitchDevice.saga),
  takeLatest(IncomingCall.action, IncomingCall.saga),
  takeEvery(ChangeMediaStatus.action, ChangeMediaStatus.saga),
  takeLatest(GetCalls.action, GetCalls.saga),
];
