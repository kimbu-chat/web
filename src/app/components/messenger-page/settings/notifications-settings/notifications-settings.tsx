import { LocalizationContext } from 'app/app';
import { SettingsActions } from 'store/settings/actions';
import { areNotificationsEnabled } from 'store/settings/selectors';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { CheckBox } from '../shared/check-box/check-box';
import './notifications-settings.scss';

export const NotificationsSettings = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const areSoundNotificationsEnabled = useSelector(areNotificationsEnabled);
  const changeSoundNotificationState = useActionWithDispatch(SettingsActions.changeNotificationSoundStateAction);

  return (
    <div className='notifications-settings'>
      <CheckBox
        nestingLevel={0}
        onClick={changeSoundNotificationState}
        isChecked={areSoundNotificationsEnabled}
        title={t('notificationsSettings.newMessageSound')}
      />
    </div>
  );
});
