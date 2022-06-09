import { AcceptCallSuccess } from './features/accept-call/accept-call-success';
import { AcceptCall } from './features/accept-call/accept-call';
import { CancelCallSuccess } from './features/cancel-call/cancel-call-success';
import { CancelCall } from './features/cancel-call/cancel-call';
import { ChangeActiveDeviceId } from './features/change-active-device-id/change-active-device-id';
import { OpenInterlocutorAudioStatus } from './features/change-interlocutor-media-status/open-interlocutor-audio-status';
import { OpenInterlocutorVideoStatus } from './features/change-interlocutor-media-status/open-interlocutor-video-status';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { CloseScreenShareStatus } from './features/change-screen-share-status/close-screen-share-status';
import { OpenScreenShareStatus } from './features/change-screen-share-status/open-screen-share-status';
import { ChangeMediaStatus } from './features/change-user-media-status/change-media-status';
import { CloseAudioStatus } from './features/change-user-media-status/close-audio-status';
import { CloseVideoStatus } from './features/change-user-media-status/close-video-status';
import { OpenAudioStatus } from './features/change-user-media-status/open-audio-status';
import { OpenVideoStatus } from './features/change-user-media-status/open-video-status';
import { DeclineCall } from './features/decline-call/decline-call';
import { KillDeviceUpdateWatcher } from './features/device-watcher/kill-device-update-watcher';
import { SpawnDeviceUpdateWatcher } from './features/device-watcher/spawn-device-update-watcher';
import { EndCall } from './features/end-call/end-call';
import { GetCallsSuccess } from './features/get-calls/get-calls-success';
import { GetCalls } from './features/get-calls/get-calls';
import { GotDevicesInfo } from './features/got-devices-info/got-devices-info';
import { InterlocutorBusy } from './features/interlocutor-busy/interlocutor-busy';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { ResetSearchCalls } from './features/reset-search-calls/reset-search-calls';
import { SwitchDevice } from './features/switch-device/switch-device';
import { TimeoutCall } from './features/timeout-call/timeout-call';
import { CallEndedEventHandlerSuccess } from './socket-events/call-ended/call-ended-event-handler-success';
import { CallEndedEventHandler } from './socket-events/call-ended/call-ended-event-handler';
import { IncomingCallEventHandler } from './socket-events/incoming-call/incoming-call-event-handler';
import { InterlocutorAcceptedCallEventHandler } from './socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { RenegotiationAcceptedEventHandler } from './socket-events/renegotiation-accepted/renegotiation-accepted-event-handler';
import { RenegotiationSentEventHandler } from './socket-events/renegotiation-sent/renegotiation-sent-event-handler';

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
export const callEndedEventHandlerAction = CallEndedEventHandler.action;
export const callEndedEventHandlerSuccessAction = CallEndedEventHandlerSuccess.action;

export type CallActions = typeof getCallsAction &
  typeof getCallsSuccessAction &
  typeof outgoingCallAction &
  typeof changeActiveDeviceIdAction &
  typeof interlocutorBusyAction &
  typeof cancelCallAction &
  typeof cancelCallSuccessAction &
  typeof resetSearchCallsAction &
  typeof declineCallAction &
  typeof endCallAction &
  typeof timeoutCallAction &
  typeof acceptCallAction &
  typeof changeMediaStatusAction &
  typeof changeScreenShareStatusAction &
  typeof closeScreenShareStatusAction &
  typeof openScreenShareStatusAction &
  typeof closeVideoStatusAction &
  typeof openVideoStatusAction &
  typeof closeAudioStatusAction &
  typeof openAudioStatusAction &
  typeof gotDevicesInfoAction &
  typeof switchDeviceAction &
  typeof acceptCallSuccessAction &
  typeof spawnDeviceUpdateWatcherAction &
  typeof killDeviceUpdateWatcherAction &
  typeof openInterlocutorVideoStatusAction &
  typeof openInterlocutorAudioStatusAction &
  typeof incomingCallEventHandlerAction &
  typeof renegotiationSentEventHandlerAction &
  typeof renegotiationAcceptedEventHandlerAction &
  typeof interlocutorAcceptedCallEventHandlerAction &
  typeof callEndedEventHandlerAction &
  typeof callEndedEventHandlerSuccessAction;
