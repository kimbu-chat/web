import { createAction } from '@reduxjs/toolkit';

export class SendSmsCodeFailure {
  static get action() {
    return createAction('SEND_PHONE_CONFIRMATION_CODE_FAILURE');
  }
}
