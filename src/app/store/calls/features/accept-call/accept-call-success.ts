import { createEmptyAction } from 'app/store/common/actions';

export class AcceptCallSuccess {
  static get action() {
    return createEmptyAction('ACCEPT_CALL_SUCCESS');
  }
}
