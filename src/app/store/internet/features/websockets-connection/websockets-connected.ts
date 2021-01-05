import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { IInternetState } from '../../models';

export class WebsocketsConnected {
  static get action() {
    return createEmptyAction('WEBSOCKETS_CONNECTED');
  }

  static get reducer() {
    return produce((draft: IInternetState) => {
      draft.isWebSocketConnected = true;
      return draft;
    });
  }
}
