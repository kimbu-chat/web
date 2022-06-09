import { createAction } from '@reduxjs/toolkit';

import { IInternetState } from '../../internet-state';

export class InternetDisconnected {
  static get action() {
    return createAction('INTERNET_DISCONNECTED');
  }

  static get reducer() {
    return (draft: IInternetState) => {
      draft.isInternetConnected = false;
      return draft;
    };
  }
}
