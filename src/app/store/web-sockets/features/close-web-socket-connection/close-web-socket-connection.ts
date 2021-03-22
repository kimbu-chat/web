import { createEmptyAction } from '@store/common/actions';

export class CloseWebsocketConnection {
  static get action() {
    return createEmptyAction('CLOSE_WEB_SOCKET_CONNECTION');
  }
}
