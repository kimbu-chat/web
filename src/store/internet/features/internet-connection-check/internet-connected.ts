import { createAction } from '@reduxjs/toolkit';

import { IInternetState } from '../../internet-state';

export class InternetConnected {
  static get action() {
    return createAction('INTERNET_CONNECTED');
  }

  static get reducer() {
    return (draft: IInternetState) => {
      draft.isInternetConnected = true;
      return draft;
    };
  }
}
