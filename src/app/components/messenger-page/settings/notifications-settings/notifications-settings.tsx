import { SettingsActions } from 'app/store/settings/actions';
import { areNotificationsEnabled } from 'app/store/settings/selectors';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import React from 'react';
import { useSelector } from 'react-redux';
import CheckBox from '../shared/check-box/check-box';
import './notifications-settings.scss';

const NotificationsSettings = () => {
	const areSoundNotificationsEnabled = useSelector(areNotificationsEnabled);
	const changeSoundNotificationState = useActionWithDispatch(SettingsActions.changeNotificationsSoundStateAction);

	return (
		<div className='notifications-settings'>
			<CheckBox
				nestingLevel={0}
				onClick={changeSoundNotificationState}
				isChecked={areSoundNotificationsEnabled}
				title={'New messages sound notification'}
			/>
		</div>
	);
};

export default NotificationsSettings;
