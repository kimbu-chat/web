import { createEmptyAction } from 'app/store/common/actions';

export class InitSocketConnection {
  static get action() {
    return createEmptyAction('INIT_SOCKET_CONNECTION');
  }
}
