import { createAction } from '@reduxjs/toolkit';

export class InitSocketConnection {
  static get action() {
    return createAction('INIT_SOCKET_CONNECTION');
  }
}
