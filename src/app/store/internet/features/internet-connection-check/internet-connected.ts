import produce from 'immer';
import { createEmptyAction } from '@store/common/actions';
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
