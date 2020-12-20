import { takeLatest, takeEvery, spawn } from 'redux-saga/effects';
import { EndCall } from './features/end-call/end-call';
import { CancelCall } from './features/cancel-call/cancel-call';
import { AcceptCall } from './features/accept-call/accept-call';
import { GetCalls } from './features/get-calls/get-calls';
import { DeclineCall } from './features/decline-call/decline-call';
import { InterlocutorAcceptedCall } from './features/interlocutor-accepted-call/interlocutor-accepted-call';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { TimeoutCall } from './features/timeout-call/timeout-call';
import { CallEnded } from './features/end-call/call-ended';
import { Candidate } from './features/candidate/candidate';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { SwitchDevice } from './features/switch-device/switch-device';
import { ChangeMediaStatus } from './features/change-user-media-status/change-media-status';

//! important peer whitch has initiated the call  is the polite one

export const CallsSagas = [
  takeLatest(OutgoingCall.action, OutgoingCall.saga),
  takeLatest(CancelCall.action, CancelCall.saga),
  takeLatest(EndCall.action, EndCall.saga),
  takeLatest(DeclineCall.action, DeclineCall.saga),
  takeLatest(TimeoutCall.action, TimeoutCall.saga),
  takeLatest(AcceptCall.action, AcceptCall.saga),
  takeLatest(InterlocutorAcceptedCall.action, InterlocutorAcceptedCall.saga),
  takeEvery(Candidate.action, Candidate.saga),
  takeLatest(CallEnded.action, CallEnded.saga),
  takeLatest(ChangeScreenShareStatus.action, ChangeScreenShareStatus.saga),
  takeLatest(SwitchDevice.action, SwitchDevice.saga),
  takeEvery(ChangeMediaStatus.action, ChangeMediaStatus.saga),
  takeLatest(GetCalls.action, GetCalls.saga),
  spawn(ChangeMediaStatus.saga),
];
