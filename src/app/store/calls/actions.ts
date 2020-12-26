import { Renegotiation } from './features/renegotiation/renegotiation';
import { AcceptCall } from './features/accept-call/accept-call';
import { CallEnded } from './features/end-call/call-ended';
import { CancelCall } from './features/cancel-call/cancel-call';
import { CancelCallSuccess } from './features/cancel-call/cancel-call-success';
import { Candidate } from './features/candidate/candidate';
import { ChangeActiveDeviceId } from './features/change-active-device-id/change-active-device-id';
import { ChangeMediaStatus } from './features/change-user-media-status/change-media-status';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { CloseAudioStatus } from './features/change-user-media-status/close-audio-status';
import { CloseScreenShareStatus } from './features/change-screen-share-status/close-screen-share-status';
import { CloseVideoStatus } from './features/change-user-media-status/close-video-status';
import { DeclineCall } from './features/decline-call/decline-call';
import { EndCall } from './features/end-call/end-call';
import { GetCalls } from './features/get-calls/get-calls';
import { GetCallsSuccess } from './features/get-calls/get-calls-success';
import { GotDevicesInfo } from './features/got-devices-info/got-devices-info';
import { IncomingCall } from './features/incoming-call/incoming-call';
import { InterlocutorAcceptedCall } from './features/interlocutor-accepted-call/interlocutor-accepted-call';
import { InterlocutorBusy } from './features/interlocutor-busy/interlocutor-busy';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { SwitchDevice } from './features/switch-device/switch-device';
import { TimeoutCall } from './features/timeout-call/timeout-call';
import { AcceptCallSuccess } from './features/accept-call/accept-call-success';
import { OpenAudioStatus } from './features/change-user-media-status/open-audio-status';
import { OpenVideoStatus } from './features/change-user-media-status/open-video-status';
import { OpenScreenShareStatus } from './features/change-screen-share-status/open-screen-share-status';

export namespace CallActions {
  export const getCallsAction = GetCalls.action;
  export const getCallsSuccessAction = GetCallsSuccess.action;
  export const outgoingCallAction = OutgoingCall.action;
  export const incomingCallAction = IncomingCall.action;
  export const changeActiveDeviceIdAction = ChangeActiveDeviceId.action;
  export const interlocutorBusyAction = InterlocutorBusy.action;
  export const cancelCallAction = CancelCall.action;
  export const declineCallAction = DeclineCall.action;
  export const endCallAction = EndCall.action;
  export const timeoutCallAction = TimeoutCall.action;
  export const cancelCallSuccessAction = CancelCallSuccess.action;
  export const acceptCallAction = AcceptCall.action;
  export const interlocutorAcceptedCallAction = InterlocutorAcceptedCall.action;
  export const callEndedAction = CallEnded.action;
  export const candidateAction = Candidate.action;
  export const changeMediaStatusAction = ChangeMediaStatus.action;
  export const changeScreenShareStatusAction = ChangeScreenShareStatus.action;
  export const closeScreenShareStatusAction = CloseScreenShareStatus.action;
  export const openScreenShareStatus = OpenScreenShareStatus.action;
  export const closeVideoStatusAction = CloseVideoStatus.action;
  export const openVideoStatusAction = OpenVideoStatus.action;
  export const closeAudioStatusAction = CloseAudioStatus.action;
  export const openAudioStatusAction = OpenAudioStatus.action;
  export const gotDevicesInfoAction = GotDevicesInfo.action;
  export const switchDeviceAction = SwitchDevice.action;
  export const acceptCallSuccessAction = AcceptCallSuccess.action;
  export const renegotiationAction = Renegotiation.action;
}
