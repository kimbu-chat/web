import { RenegotiationSentEventHandler } from './socket-events/renegotiation-sent/renegotiation-sent-event-handler';
import { AcceptCall } from './features/accept-call/accept-call';
import { CallEndedEventHandler } from './socket-events/call-ended/call-ended-event-handler';
import { CancelCall } from './features/cancel-call/cancel-call';
import { CancelCallSuccess } from './features/cancel-call/cancel-call-success';
import { IceCandidateSentEventHandler } from './socket-events/ice-candidate-sent/ice-candidate-sent-event-handler';
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
import { IncomingCallEventHandler } from './socket-events/incoming-call/incoming-call-event-handler';
import { InterlocutorAcceptedCallEventHandler } from './socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { InterlocutorBusy } from './features/interlocutor-busy/interlocutor-busy';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { SwitchDevice } from './features/switch-device/switch-device';
import { TimeoutCall } from './features/timeout-call/timeout-call';
import { AcceptCallSuccess } from './features/accept-call/accept-call-success';
import { OpenAudioStatus } from './features/change-user-media-status/open-audio-status';
import { OpenVideoStatus } from './features/change-user-media-status/open-video-status';
import { OpenScreenShareStatus } from './features/change-screen-share-status/open-screen-share-status';
import { RenegotiationAcceptedEventHandler } from './socket-events/renegotiation-accepted/renegotiation-accepted-event-handler';
import { OpenInterlocutorVideoStatus } from './features/change-interlocutor-media-status/open-interlocutor-video-status';
import { CallEndedEventHandlerSuccess } from './socket-events/call-ended/call-ended-event-handler-success';
import { SpawnDeviceUpdateWatcher } from './features/device-watcher/spawn-device-update-watcher';
import { KillDeviceUpdateWatcher } from './features/device-watcher/kill-device-update-watcher';
import { OpenInterlocutorAudioStatus } from './features/change-interlocutor-media-status/open-interlocutor-audio-status';
import { ResetSearchCalls } from './features/reset-search-calls/reset-search-calls';

// CallActions
export const getCallsAction = GetCalls.action;
export const getCallsSuccessAction = GetCallsSuccess.action;
export const outgoingCallAction = OutgoingCall.action;
export const changeActiveDeviceIdAction = ChangeActiveDeviceId.action;
export const interlocutorBusyAction = InterlocutorBusy.action;
export const cancelCallAction = CancelCall.action;
export const cancelCallSuccessAction = CancelCallSuccess.action;
export const declineCallAction = DeclineCall.action;
export const endCallAction = EndCall.action;
export const timeoutCallAction = TimeoutCall.action;
export const acceptCallAction = AcceptCall.action;
export const changeMediaStatusAction = ChangeMediaStatus.action;
export const changeScreenShareStatusAction = ChangeScreenShareStatus.action;
export const closeScreenShareStatusAction = CloseScreenShareStatus.action;
export const openScreenShareStatusAction = OpenScreenShareStatus.action;
export const closeVideoStatusAction = CloseVideoStatus.action;
export const openVideoStatusAction = OpenVideoStatus.action;
export const closeAudioStatusAction = CloseAudioStatus.action;
export const openAudioStatusAction = OpenAudioStatus.action;
export const gotDevicesInfoAction = GotDevicesInfo.action;
export const switchDeviceAction = SwitchDevice.action;
export const acceptCallSuccessAction = AcceptCallSuccess.action;
export const spawnDeviceUpdateWatcherAction = SpawnDeviceUpdateWatcher.action;
export const killDeviceUpdateWatcherAction = KillDeviceUpdateWatcher.action;
export const openInterlocutorVideoStatusAction = OpenInterlocutorVideoStatus.action;
export const openInterlocutorAudioStatusAction = OpenInterlocutorAudioStatus.action;
export const resetSearchCallsAction = ResetSearchCalls.action;

// socket-events
export const incomingCallEventHandlerAction = IncomingCallEventHandler.action;
export const renegotiationSentEventHandlerAction = RenegotiationSentEventHandler.action;
export const renegotiationAcceptedEventHandlerAction = RenegotiationAcceptedEventHandler.action;
export const interlocutorAcceptedCallEventHandlerAction =
  InterlocutorAcceptedCallEventHandler.action;
export const iceCandidateSentEventHandlerAction = IceCandidateSentEventHandler.action;
export const callEndedEventHandlerAction = CallEndedEventHandler.action;
export const callEndedEventHandlerSuccessAction = CallEndedEventHandlerSuccess.action;

export const CallActions = {
  getCallsAction,
  getCallsSuccessAction,
  outgoingCallAction,
  changeActiveDeviceIdAction,
  interlocutorBusyAction,
  cancelCallAction,
  cancelCallSuccessAction,
  resetSearchCallsAction,
  declineCallAction,
  endCallAction,
  timeoutCallAction,
  acceptCallAction,
  changeMediaStatusAction,
  changeScreenShareStatusAction,
  closeScreenShareStatusAction,
  openScreenShareStatusAction,
  closeVideoStatusAction,
  openVideoStatusAction,
  closeAudioStatusAction,
  openAudioStatusAction,
  gotDevicesInfoAction,
  switchDeviceAction,
  acceptCallSuccessAction,
  spawnDeviceUpdateWatcherAction,
  killDeviceUpdateWatcherAction,
  openInterlocutorVideoStatusAction,
  openInterlocutorAudioStatusAction,
  incomingCallEventHandlerAction,
  renegotiationSentEventHandlerAction,
  renegotiationAcceptedEventHandlerAction,
  interlocutorAcceptedCallEventHandlerAction,
  iceCandidateSentEventHandlerAction,
  callEndedEventHandlerAction,
  callEndedEventHandlerSuccessAction,
};
