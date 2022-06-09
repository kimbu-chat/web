import { createAction } from '@reduxjs/toolkit';

import { IUserSettings } from '@store/settings/user-settings-state';

export class ChangePushNotificationStateSuccess {
  static get action() {
    return createAction('CHANGE_PUSH_NOTIFICATIONS_STATE_SUCCESS');
  }

  static get reducer() {
    return (draft: IUserSettings) => {
      draft.pushNotificationsEnabled = !draft.pushNotificationsEnabled;
      return draft;
    };
  }
}
