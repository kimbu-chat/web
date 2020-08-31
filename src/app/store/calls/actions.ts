import { createAction } from 'typesafe-actions';
import {
	OutgoingCallActionPayload,
	IncomingCallActionPayload,
	AcceptIncomingCallActionPayload,
	InterlocutorAcceptCallActionPayload,
	CandidateActionPayload,
	ChangeMediaStatusActionPayload,
	GotMediaDevicesInfoActionPayload,
	SwitchDeviceActionPayload,
} from './models';
import { createEmptyAction } from '../common/actions';

export namespace CallActions {
	export const outgoingCallAction = createAction('OUTGOING_CALL')<OutgoingCallActionPayload>();
	export const incomingCallAction = createAction('INCOMING_CALL')<IncomingCallActionPayload>();
	export const cancelCallAction = createEmptyAction('CANCEL_CALL');
	export const timeoutCallAction = createEmptyAction('TIMEOUT_CALL');
	export const cancelCallSuccessAction = createEmptyAction('CANCEL_CALL_SUCCESS');
	export const acceptCallAction = createAction('ACCEPT_CALL')<AcceptIncomingCallActionPayload>();
	export const acceptCallSuccessAction = createAction('ACCEPT_CALL_SUCCESS')<AcceptIncomingCallActionPayload>();
	export const interlocutorCanceledCallAction = createEmptyAction('INTERLOCUTOR_CANCELED_CALL');
	export const interlocutorAcceptedCallAction = createAction('INTERLOCUTOR_ACCEPTED_CALL')<
		InterlocutorAcceptCallActionPayload
	>();
	export const callEndedAction = createEmptyAction('CALL_ENDED');
	export const candidateAction = createAction('CANDIDATE')<CandidateActionPayload>();
	export const changeMediaStatusAction = createAction('CHANGE_MEDIA_STATUS')<ChangeMediaStatusActionPayload>();
	export const changeScreenShareStatusAction = createEmptyAction('CHANGE_SCREEN_SHARE_STATUS');
	export const gotDevicesInfoAction = createAction('GOT_DEVICES_INFO')<GotMediaDevicesInfoActionPayload>();
	export const switchDeviceAction = createAction('SWITCH_DEVICE')<SwitchDeviceActionPayload>();
	export const enableMediaSwitchingAction = createEmptyAction('ENABLE_MEDIA');
	export const changeFullScreenStatusAction = createEmptyAction('CHANGE_FULL_SCREEN_STATUS');
}
