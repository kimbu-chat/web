import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { IInternetState } from '../../models';

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
