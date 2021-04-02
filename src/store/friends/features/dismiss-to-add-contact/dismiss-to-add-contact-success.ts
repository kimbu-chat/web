import { createAction } from 'typesafe-actions';

export class DismissToAddContactSuccess {
  static get action() {
    return createAction('DISMISS_TO_ADD_CONTACT_SUCCESS')<number>();
  }
}
