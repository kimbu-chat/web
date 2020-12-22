import { createReducer } from 'typesafe-actions';
import { DeclineCall } from 'app/store/calls/features/decline-call/decline-call';
import { CallState } from './models';
import { IncomingCall } from './features/incoming-call/incoming-call';
import { AcceptCall } from './features/accept-call/accept-call';
import { CallEnded } from './features/end-call/call-ended';
import { CancelCallSuccess } from './features/cancel-call/cancel-call-success';
import { ChangeActiveDeviceId } from './features/change-active-device-id/change-active-device-id';
import { ChangeMediaStatus } from './features/change-user-media-status/change-media-status';
import { CloseAudioStatus } from './features/change-user-media-status/close-audio-status';
import { CloseScreenShareStatus } from './features/change-screen-share-status/close-screen-share-status';
import { CloseVideoStatus } from './features/change-user-media-status/close-video-status';
import { GetCallsSuccess } from './features/get-calls/get-calls-success';
import { GotDevicesInfo } from './features/got-devices-info/got-devices-info';
import { InterlocutorBusy } from './features/interlocutor-busy/interlocutor-busy';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { SwitchDevice } from './features/switch-device/switch-device';
import { GetCalls } from './features/get-calls/get-calls';
import { EndCall } from './features/end-call/end-call';
import { InterlocutorAcceptedCall } from './features/interlocutor-accepted-call/interlocutor-accepted-call';
import { AcceptCallSuccess } from './features/accept-call/accept-call-success';

const initialState: CallState = {
  isInterlocutorVideoEnabled: false,
  isInterlocutorBusy: false,
  amICalled: false,
  amICaling: false,
  isSpeaking: false,
  videoConstraints: {
    isOpened: false,
    width: { min: 640, ideal: window.innerWidth, max: 1920 },
    height: { min: 480, ideal: window.innerHeight, max: 1440 },
  },
  audioConstraints: { isOpened: true },
  isScreenSharingOpened: false,
  audioDevicesList: [],
  videoDevicesList: [],
  calls: {
    calls: [],
    loading: false,
    hasMore: true,
  },
};

const calls = createReducer<CallState>(initialState)
  .handleAction(IncomingCall.action, IncomingCall.reducer)
  .handleAction(OutgoingCall.action, OutgoingCall.reducer)
  .handleAction(CancelCallSuccess.action, CancelCallSuccess.reducer)
  .handleAction(AcceptCall.action, AcceptCall.reducer)
  .handleAction(InterlocutorAcceptedCall.action, InterlocutorAcceptedCall.reducer)
  .handleAction(CallEnded.action, CallEnded.reducer)
  .handleAction(ChangeMediaStatus.action, ChangeMediaStatus.reducer)
  .handleAction(ChangeScreenShareStatus.action, ChangeScreenShareStatus.reducer)
  .handleAction(CloseScreenShareStatus.action, CloseScreenShareStatus.reducer)
  .handleAction(CloseAudioStatus.action, CloseAudioStatus.reducer)
  .handleAction(CloseVideoStatus.action, CloseVideoStatus.reducer)
  .handleAction(GotDevicesInfo.action, GotDevicesInfo.reducer)
  .handleAction(SwitchDevice.action, SwitchDevice.reducer)
  .handleAction(ChangeActiveDeviceId.action, ChangeActiveDeviceId.reducer)
  .handleAction(GetCalls.action, GetCalls.reducer)
  .handleAction(GetCallsSuccess.action, GetCallsSuccess.reducer)
  .handleAction(InterlocutorBusy.action, InterlocutorBusy.reducer)
  .handleAction(DeclineCall.action, DeclineCall.reducer)
  .handleAction(EndCall.action, EndCall.reducer)
  .handleAction(AcceptCallSuccess.action, AcceptCallSuccess.reducer);

export default calls;
