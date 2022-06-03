import { createAction } from '@reduxjs/toolkit';

import { IInternetState } from '../../internet-state';

export class WebsocketsDisconnected {
  static get action() {
    return createAction('WEBSOCKETS_DISCONNECTED');
  }

  static get reducer() {
    return (draft: IInternetState) => {
      draft.isWebSocketConnected = false;
      return draft;
    };
  }
}
