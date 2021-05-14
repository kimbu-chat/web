import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { IInternetState } from '../../internet-state';

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
