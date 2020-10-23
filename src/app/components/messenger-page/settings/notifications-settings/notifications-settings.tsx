import { LocalizationContext } from 'app/app';
import { SettingsActions } from 'app/store/settings/actions';
import { areNotificationsEnabled } from 'app/store/settings/selectors';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import CheckBox from '../shared/check-box/check-box';
import './notifications-settings.scss';

const NotificationsSettings = () => {
	const { t } = useContext(LocalizationContext);

	const areSoundNotificationsEnabled = useSelector(areNotificationsEnabled);
	const changeSoundNotificationState = useActionWithDispatch(SettingsActions.changeNotificationsSoundStateAction);

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
};

export default NotificationsSettings;
