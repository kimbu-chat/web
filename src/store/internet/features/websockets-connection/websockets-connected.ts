import { createAction } from '@reduxjs/toolkit';

import { IInternetState } from '../../internet-state';

export class WebsocketsConnected {
  static get action() {
    return createAction('WEBSOCKETS_CONNECTED');
  }

  static get reducer() {
    return (draft: IInternetState) => {
      draft.isWebSocketConnected = true;
      return draft;
    };
  }
}
