import { AcceptCall } from './features/accept-call/accept-call';
import { CancelCall } from './features/cancel-call/cancel-call';
import { OpenInterlocutorAudioStatus } from './features/change-interlocutor-media-status/open-interlocutor-audio-status';
import { OpenInterlocutorVideoStatus } from './features/change-interlocutor-media-status/open-interlocutor-video-status';
import { ChangeScreenShareStatus } from './features/change-screen-share-status/change-screen-share-status';
import { ChangeMediaStatus } from './features/change-user-media-status/change-media-status';
import { CloseAudioStatus } from './features/change-user-media-status/close-audio-status';
import { CloseVideoStatus } from './features/change-user-media-status/close-video-status';
import { DeclineCall } from './features/decline-call/decline-call';
import { KillDeviceUpdateWatcher } from './features/device-watcher/kill-device-update-watcher';
import { SpawnDeviceUpdateWatcher } from './features/device-watcher/spawn-device-update-watcher';
import { EndCall } from './features/end-call/end-call';
import { GetCalls } from './features/get-calls/get-calls';
import { OutgoingCall } from './features/outgoing-call/outgoing-call';
import { ResetSearchCalls } from './features/reset-search-calls/reset-search-calls';
import { SwitchDevice } from './features/switch-device/switch-device';
import { TimeoutCall } from './features/timeout-call/timeout-call';
import { InterlocutorAcceptedCallEventHandler } from './socket-events/interlocutor-accepted-call/interlocutor-accepted-call-event-handler';
import { RenegotiationAcceptedEventHandler } from './socket-events/renegotiation-accepted/renegotiation-accepted-event-handler';

// CallActions
export const getCallsAction = GetCalls.action;
export const outgoingCallAction = OutgoingCall.action;
export const cancelCallAction = CancelCall.action;
export const declineCallAction = DeclineCall.action;
export const endCallAction = EndCall.action;
export const timeoutCallAction = TimeoutCall.action;
export const acceptCallAction = AcceptCall.action;
export const changeMediaStatusAction = ChangeMediaStatus.action;
export const changeScreenShareStatusAction = ChangeScreenShareStatus.action;
export const closeVideoStatusAction = CloseVideoStatus.action;
export const closeAudioStatusAction = CloseAudioStatus.action;
export const switchDeviceAction = SwitchDevice.action;
export const spawnDeviceUpdateWatcherAction = SpawnDeviceUpdateWatcher.action;
export const killDeviceUpdateWatcherAction = KillDeviceUpdateWatcher.action;
export const openInterlocutorVideoStatusAction = OpenInterlocutorVideoStatus.action;
export const openInterlocutorAudioStatusAction = OpenInterlocutorAudioStatus.action;
export const resetSearchCallsAction = ResetSearchCalls.action;

// socket-events
export const renegotiationAcceptedEventHandlerAction = RenegotiationAcceptedEventHandler.action;
export const interlocutorAcceptedCallEventHandlerAction =
  InterlocutorAcceptedCallEventHandler.action;
