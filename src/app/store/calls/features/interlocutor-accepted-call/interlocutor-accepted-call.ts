import { createAction } from 'typesafe-actions';
import { InterlocutorAcceptedCallActionPayload } from '../../models';

export class InterlocutorAcceptedCall {
  static get action() {
    return createAction('INTERLOCUTOR_ACCEPTED_CALL')<InterlocutorAcceptedCallActionPayload>();
  }
}
