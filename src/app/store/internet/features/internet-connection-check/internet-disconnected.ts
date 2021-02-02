import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
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
