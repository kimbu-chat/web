import { createAction } from '@reduxjs/toolkit';

export class CloseWebsocketConnection {
  static get action() {
    return createAction('CLOSE_WEB_SOCKET_CONNECTION');
  }
}
