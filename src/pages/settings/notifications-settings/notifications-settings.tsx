import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { CheckBox } from '@components/check-box';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import {
  changeNotificationSoundStateAction,
  changePushNotificationStateAction,
} from '@store/settings/actions';
import {
  areNotificationsEnabledSelector,
  arePushNotificationsEnabledSelector,
} from '@store/settings/selectors';

import './notifications-settings.scss';

const NotificationsSettings = () => {
  const { t } = useTranslation();

  const [pushNotificationsLoading, setPushNotificationsLoading] = useState(false);

  const areSoundNotificationsEnabled = useSelector(areNotificationsEnabledSelector);
  const arePushNotificationsEnabled = useSelector(arePushNotificationsEnabledSelector);

  const changeSoundNotificationState = useActionWithDispatch(changeNotificationSoundStateAction);
  const changePushNotificationState = useActionWithDeferred(changePushNotificationStateAction);

  const togglePushNotification = useCallback(() => {
    setPushNotificationsLoading(true);
    changePushNotificationState().then(() => {
      setPushNotificationsLoading(false);
    });
  }, [changePushNotificationState, setPushNotificationsLoading]);

  return (
    <div className="notifications-settings">
      <div className="notifications-settings__title">{t('notificationsSettings.title')}</div>

      <div className="notifications-settings__entity">
        <CheckBox
          loading={pushNotificationsLoading}
          onClick={togglePushNotification}
          isChecked={arePushNotificationsEnabled}
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
    </div>
  );
};

export default NotificationsSettings;
