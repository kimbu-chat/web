import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';

import { IInternetState } from '../../internet-state';

export class InternetDisconnected {
  static get action() {
    return createEmptyAction('INTERNET_DISCONNECTED');
  }

  static get reducer() {
    return produce((draft: IInternetState) => {
      draft.isInternetConnected = false;
      return draft;
    });
  }
}
