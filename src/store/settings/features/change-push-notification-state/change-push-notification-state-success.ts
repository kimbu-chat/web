import produce from 'immer';

import { createEmptyAction } from '@store/common/actions';
import { IUserSettings } from '@store/settings/user-settings-state';

export class ChangePushNotificationStateSuccess {
  static get action() {
    return createEmptyAction('CHANGE_PUSH_NOTIFICATIONS_STATE_SUCCESS');
  }

  static get reducer() {
    return produce((draft: IUserSettings) => {
      draft.pushNotificationsEnabled = !draft.pushNotificationsEnabled;
      return draft;
    });
  }
}
