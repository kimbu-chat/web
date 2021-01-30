import { createReducer } from 'typesafe-actions';
import { DeclineCall } from 'app/store/calls/features/decline-call/decline-call';
import { RenegotiationSentEventHandler } from 'app/store/calls/socket-events/renegotiation-sent/renegotiation-sent-event-handler';
import { ICallsState } from './calls-state';
import { IncomingCallEventHandler } from './socket-events/incoming-call/incoming-call-event-handler';
import { AcceptCall } from './features/accept-call/accept-call';
import { CancelCallSuccess } from './features/cancel-call/cancel-call-success';
import { ChangeActiveDeviceId } from './features/change-active-device-id/change-active-device-id';
import { CloseAudioStatus } from './features/change-user-media-status/close-audio-status';
import { CloseScreenShareStatus } from './features/change-screen-share-status/close-screen-share-status';
import { CloseVideoStatus } from './features/change-user-media-status/close-video-status';
import { GetCallsSuccess } from './features/get-calls/get-calls-success';
import { GotDevicesInfo } from './features/got-devices-info/got-devices-info';
import { InterlocutorBusy } from './features/interlocutor-busy/interlocutor-busy';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { SwitchDevice } from './features/switch-device/switch-device';
import { GetCalls } from './features/get-calls/get-calls';
import { EndCall } from './features/end-call/end-call';
import { InterlocutorAcceptedCallEventHandler } from './socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { AcceptCallSuccess } from './features/accept-call/accept-call-success';
import { OpenAudioStatus } from './features/change-user-media-status/open-audio-status';
import { OpenVideoStatus } from './features/change-user-media-status/open-video-status';
import { OpenScreenShareStatus } from './features/change-screen-share-status/open-screen-share-status';
import { OpenInterlocutorVideoStatus } from './features/change-interlocutor-media-status/open-interlocutor-video-status';
import { UserEditedEventHandler } from './socket-events/user-edited/user-edited-event-handler';

const initialState: ICallsState = {
  isInterlocutorVideoEnabled: false,
  isInterlocutorBusy: false,
  amICalled: false,
  amICalling: false,
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

const calls = createReducer<ICallsState>(initialState)
  .handleAction(OutgoingCall.action, OutgoingCall.reducer)
  .handleAction(CancelCallSuccess.action, CancelCallSuccess.reducer)
  .handleAction(AcceptCall.action, AcceptCall.reducer)
  .handleAction(CloseScreenShareStatus.action, CloseScreenShareStatus.reducer)
  .handleAction(OpenScreenShareStatus.action, OpenScreenShareStatus.reducer)
  .handleAction(CloseAudioStatus.action, CloseAudioStatus.reducer)
  .handleAction(OpenAudioStatus.action, OpenAudioStatus.reducer)
  .handleAction(CloseVideoStatus.action, CloseVideoStatus.reducer)
  .handleAction(OpenVideoStatus.action, OpenVideoStatus.reducer)
  .handleAction(GotDevicesInfo.action, GotDevicesInfo.reducer)
  .handleAction(SwitchDevice.action, SwitchDevice.reducer)
  .handleAction(ChangeActiveDeviceId.action, ChangeActiveDeviceId.reducer)
  .handleAction(GetCalls.action, GetCalls.reducer)
  .handleAction(GetCallsSuccess.action, GetCallsSuccess.reducer)
  .handleAction(InterlocutorBusy.action, InterlocutorBusy.reducer)
  .handleAction(DeclineCall.action, DeclineCall.reducer)
  .handleAction(EndCall.action, EndCall.reducer)
  .handleAction(AcceptCallSuccess.action, AcceptCallSuccess.reducer)
  .handleAction(OpenInterlocutorVideoStatus.action, OpenInterlocutorVideoStatus.reducer)

  // socket-events
  .handleAction(IncomingCallEventHandler.action, IncomingCallEventHandler.reducer)
  .handleAction(InterlocutorAcceptedCallEventHandler.action, InterlocutorAcceptedCallEventHandler.reducer)
  .handleAction(UserEditedEventHandler.action, UserEditedEventHandler.reducer)
  .handleAction(RenegotiationSentEventHandler.action, RenegotiationSentEventHandler.reducer);

export default calls;
