import { createAction } from 'typesafe-actions';
import { IOutgoingCall, IIncomingCall, ICancelCall, IAcceptCall, ICallEnded, ICandidateAction } from './models';

export namespace CallActions {
	export const outgoingCallAction = createAction('OUTGOING_CALL')<IOutgoingCall>();
	export const incomingCallAction = createAction('INCOMING_CALL')<IIncomingCall>();
	export const cancelCallAction = createAction('CANCEL_CALL')<ICancelCall>();
	export const acceptCallAction = createAction('ACCEPT_CALL')<IAcceptCall>();
	export const interlocutorCanceledCallAction = createAction('INTERLOCUTOR_CANCELED_CALL')<ICancelCall>();
	export const interlocutorAcceptedCallAction = createAction('INTERLOCUTOR_ACCEPTED_CALL')<IAcceptCall>();
	export const callEndedAction = createAction('CALL_ENDED')<ICallEnded>();
	export const candidateAction = createAction('CANDIDATE')<ICandidateAction>();
}
