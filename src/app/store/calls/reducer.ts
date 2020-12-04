import { createReducer } from 'typesafe-actions';
import { CallState } from './models';
import { IncomingCall } from './features/incoming-call';
import { AcceptCall } from './features/accept-call';
import { CallEnded } from './features/call-ended';
import { CancelCallSuccess } from './features/cancel-call-success';
import { ChangeActiveDeviceId } from './features/change-active-device-id';
import { ChangeMediaStatus } from './features/change-media-status';
import { CloseAudioStatus } from './features/close-audio-status';
import { CloseScreenShareStatus } from './features/close-screen-share-status';
import { CloseVideoStatus } from './features/close-video-status';
import { GetCallsSuccess } from './features/get-calls-success';
import { GotDevicesInfo } from './features/got-devices-info';
import { InterlocutorBusy } from './features/interlocutor-busy';
import { InterlocutorCanceledCall } from './features/interlocutor-canceled-call';
import { ChangeScreenShareStatus } from './features/change-screen-share-status';
import { OutgoingCall } from './features/outgoing-call';
import { AcceptCallSuccess } from './features/accept-call-success';
import { SwitchDevice } from './features/switch-device';
import { InterlocutorAcceptedCallSuccess } from './features/interlocutor-accepted-call-success';

const initialState: CallState = {
  isInterlocutorVideoEnabled: false,
  amICalled: false,
  isInterlocutorBusy: false,
  isScreenSharingOpened: false,
  isSpeaking: false,
  videoConstraints: {
    isOpened: false,
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1440, max: 1440 },
  },
  audioConstraints: { isOpened: true },
  amICaling: false,
  interlocutor: undefined,
  offer: undefined,
  answer: undefined,
  audioDevicesList: [],
  videoDevicesList: [],
  calls: [],
  hasMore: true,
};

const calls = createReducer<CallState>(initialState)
  .handleAction(IncomingCall.action, IncomingCall.reducer)
  .handleAction(OutgoingCall.action, OutgoingCall.reducer)
  .handleAction(CancelCallSuccess.action, CancelCallSuccess.reducer)
  .handleAction(AcceptCall.action, AcceptCall.reducer)
  .handleAction(AcceptCallSuccess.action, AcceptCallSuccess.reducer)
  .handleAction(InterlocutorCanceledCall.action, InterlocutorCanceledCall.reducer)
  .handleAction(InterlocutorAcceptedCallSuccess.action, InterlocutorAcceptedCallSuccess.reducer)
  .handleAction(CallEnded.action, CallEnded.reducer)
  .handleAction(ChangeMediaStatus.action, ChangeMediaStatus.reducer)
  .handleAction(ChangeScreenShareStatus.action, ChangeScreenShareStatus.reducer)
  .handleAction(CloseScreenShareStatus.action, CloseScreenShareStatus.reducer)
  .handleAction(CloseAudioStatus.action, CloseAudioStatus.reducer)
  .handleAction(CloseVideoStatus.action, CloseVideoStatus.reducer)
  .handleAction(GotDevicesInfo.action, GotDevicesInfo.reducer)
  .handleAction(SwitchDevice.action, SwitchDevice.reducer)
  .handleAction(ChangeActiveDeviceId.action, ChangeActiveDeviceId.reducer)
  .handleAction(GetCallsSuccess.action, GetCallsSuccess.reducer)
  .handleAction(InterlocutorBusy.action, InterlocutorBusy.reducer);

export default calls;
