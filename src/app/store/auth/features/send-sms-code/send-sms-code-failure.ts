import { createEmptyAction } from 'store/common/actions';

export class SendSmsCodeFailure {
  static get action() {
    return createEmptyAction('SEND_PHONE_CONFIRMATION_CODE_FAILURE');
  }
}
