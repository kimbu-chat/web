import { createAction } from 'typesafe-actions';
import {
	IOutgoingCall,
	IIncomingCall,
	ICandidateAction,
	IInterlocutorAcceptCall,
	IMyCandidateAction,
	IAcceptIncomingCall,
} from './models';
import { createEmptyAction } from '../common/actions';

export namespace CallActions {
	export const outgoingCallAction = createAction('OUTGOING_CALL')<IOutgoingCall>();
	export const outgoingCallSuccessAction = createAction('OUTGOING_CALL_SUCCESS')<IOutgoingCall>();
	export const incomingCallAction = createAction('INCOMING_CALL')<IIncomingCall>();
	export const cancelCallAction = createEmptyAction('CANCEL_CALL');
	export const cancelCallSuccessAction = createEmptyAction('CANCEL_CALL_SUCCESS');
	export const acceptCallAction = createAction('ACCEPT_CALL')<IAcceptIncomingCall>();
	export const acceptCallSuccessAction = createAction('ACCEPT_CALL_SUCCESS')<IAcceptIncomingCall>();
	export const interlocutorCanceledCallAction = createEmptyAction('INTERLOCUTOR_CANCELED_CALL');
	export const interlocutorAcceptedCallAction = createAction('INTERLOCUTOR_ACCEPTED_CALL')<IInterlocutorAcceptCall>();
	export const callEndedAction = createEmptyAction('CALL_ENDED');
	export const candidateAction = createAction('CANDIDATE')<ICandidateAction>();
	export const myCandidateAction = createAction('MY_CANDIDATE')<IMyCandidateAction>();
}
