import { createReducer } from '@reduxjs/toolkit';

import { ICallsState } from './calls-state';
import { AcceptCallSuccess } from './features/accept-call/accept-call-success';
import { AcceptCall } from './features/accept-call/accept-call';
import { CancelCallSuccess } from './features/cancel-call/cancel-call-success';
import { ChangeActiveDeviceId } from './features/change-active-device-id/change-active-device-id';
import { OpenInterlocutorAudioStatus } from './features/change-interlocutor-media-status/open-interlocutor-audio-status';
import { OpenInterlocutorVideoStatus } from './features/change-interlocutor-media-status/open-interlocutor-video-status';
import { CloseScreenShareStatus } from './features/change-screen-share-status/close-screen-share-status';
import { OpenScreenShareStatus } from './features/change-screen-share-status/open-screen-share-status';
import { CloseAudioStatus } from './features/change-user-media-status/close-audio-status';
import { CloseVideoStatus } from './features/change-user-media-status/close-video-status';
import { OpenAudioStatus } from './features/change-user-media-status/open-audio-status';
import { OpenVideoStatus } from './features/change-user-media-status/open-video-status';
import { DeclineCall } from './features/decline-call/decline-call';
import { EndCall } from './features/end-call/end-call';
import { GetCallsSuccess } from './features/get-calls/get-calls-success';
import { GetCalls } from './features/get-calls/get-calls';
import { GotDevicesInfo } from './features/got-devices-info/got-devices-info';
import { InterlocutorBusy } from './features/interlocutor-busy/interlocutor-busy';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { ResetSearchCalls } from './features/reset-search-calls/reset-search-calls';
import { SwitchDevice } from './features/switch-device/switch-device';
import { CallEndedEventHandlerSuccess } from './socket-events/call-ended/call-ended-event-handler-success';
import { IncomingCallEventHandler } from './socket-events/incoming-call/incoming-call-event-handler';
import { InterlocutorAcceptedCallEventHandler } from './socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { RenegotiationSentEventHandler } from './socket-events/renegotiation-sent/renegotiation-sent-event-handler';

const initialState: ICallsState = {
  isInterlocutorVideoEnabled: false,
  isInterlocutorAudioEnabled: false,
  isInterlocutorBusy: false,
  amICalled: false,
  amICalling: false,
  isSpeaking: false,
  isCallAccepted: false,
  videoConstraints: {
    isOpened: false,
    width: { min: 640, ideal: window.innerWidth, max: 1920 },
    height: { min: 480, ideal: window.innerHeight, max: 1440 },
  },
  audioConstraints: { isOpened: true },
  isScreenSharingOpened: false,
  audioDevicesList: [],
  videoDevicesList: [],
  callList: {
    callIds: [],
    loading: false,
    hasMore: true,
  },
  searchCallList: {
    callIds: [],
    loading: false,
    hasMore: true,
  },
  calls: {},
};

const reducer = createReducer<ICallsState>(initialState, builder =>
  builder.addCase(OutgoingCall.action, OutgoingCall.reducer)
    .addCase(CancelCallSuccess.action, CancelCallSuccess.reducer)
    .addCase(AcceptCall.action, AcceptCall.reducer)
    .addCase(CloseScreenShareStatus.action, CloseScreenShareStatus.reducer)
    .addCase(OpenScreenShareStatus.action, OpenScreenShareStatus.reducer)
    .addCase(CloseAudioStatus.action, CloseAudioStatus.reducer)
    .addCase(OpenAudioStatus.action, OpenAudioStatus.reducer)
    .addCase(CloseVideoStatus.action, CloseVideoStatus.reducer)
    .addCase(OpenVideoStatus.action, OpenVideoStatus.reducer)
    .addCase(GotDevicesInfo.action, GotDevicesInfo.reducer)
    .addCase(SwitchDevice.action, SwitchDevice.reducer)
    .addCase(ChangeActiveDeviceId.action, ChangeActiveDeviceId.reducer)
    .addCase(GetCalls.action, GetCalls.reducer)
    .addCase(GetCallsSuccess.action, GetCallsSuccess.reducer)
    .addCase(InterlocutorBusy.action, InterlocutorBusy.reducer)
    .addCase(DeclineCall.action, DeclineCall.reducer)
    .addCase(EndCall.action, EndCall.reducer)
    .addCase(AcceptCallSuccess.action, AcceptCallSuccess.reducer)
    .addCase(OpenInterlocutorVideoStatus.action, OpenInterlocutorVideoStatus.reducer)
    .addCase(OpenInterlocutorAudioStatus.action, OpenInterlocutorAudioStatus.reducer)
    .addCase(ResetSearchCalls.action, ResetSearchCalls.reducer)

    // web-socket events
    .addCase(IncomingCallEventHandler.action, IncomingCallEventHandler.reducer)
    .addCase(
      InterlocutorAcceptedCallEventHandler.action,
      InterlocutorAcceptedCallEventHandler.reducer,
    )
    .addCase(RenegotiationSentEventHandler.action, RenegotiationSentEventHandler.reducer)
    .addCase(CallEndedEventHandlerSuccess.action, CallEndedEventHandlerSuccess.reducer));
export default reducer;
