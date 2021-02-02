import { createEmptyAction } from 'app/store/common/actions';
import produce from 'immer';
import { IInternetState } from '../../internet-state';

export class InternetConnected {
  static get action() {
    return createEmptyAction('INTERNET_CONNECTED');
  }

  static get reducer() {
    return produce((draft: IInternetState) => {
      draft.isInternetConnected = true;
      return draft;
    });
  }
}
