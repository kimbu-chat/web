import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
import { IInternetState } from '../../internet-state';

export class WebsocketsDisconnected {
  static get action() {
    return createEmptyAction('WEBSOCKETS_DISCONNECTED');
  }

  static get reducer() {
    return produce((draft: IInternetState) => {
      draft.isWebSocketConnected = false;
      return draft;
    });
  }
}
