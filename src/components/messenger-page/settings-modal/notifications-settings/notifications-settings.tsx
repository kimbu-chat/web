import { LocalizationContext } from '@contexts';
import * as SettingsActions from '@store/settings/actions';
import { areNotificationsEnabledSelector } from '@store/settings/selectors';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { CheckBox } from '../shared/check-box/check-box';
import './notifications-settings.scss';

export const NotificationsSettings = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const areSoundNotificationsEnabled = useSelector(areNotificationsEnabledSelector);
  const changeSoundNotificationState = useActionWithDispatch(SettingsActions.changeNotificationSoundStateAction);

  return (
    <div className="notifications-settings">
      <div className="notifications-settings__title">{t('notificationsSettings.title')}</div>

      <div className="notifications-settings__entity">
        <CheckBox
          onClick={changeSoundNotificationState}
          isChecked={areSoundNotificationsEnabled}
          title={t('notificationsSettings.push-notification')}
        />
      </div>

      <div className="notifications-settings__entity">
        <CheckBox
          onClick={changeSoundNotificationState}
          isChecked={areSoundNotificationsEnabled}
          title={t('notificationsSettings.message-notification')}
        />
      </div>

      <div className="notifications-settings__entity">
        <CheckBox
          onClick={changeSoundNotificationState}
          isChecked={areSoundNotificationsEnabled}
          title={t('notificationsSettings.all-notifications')}
        />
      </div>
    </div>
  );
});
