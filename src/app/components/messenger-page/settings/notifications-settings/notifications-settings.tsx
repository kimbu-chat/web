import React from 'react';
import CheckBox from './check-box/check-box';
import './notifications-settings.scss';

const NotificationsSettings = () => {
	return (
		<div className='notifications-settings'>
			<CheckBox nestingLevel={0} onClick={() => {}} isChecked={true} title={'New messages sound notification'} />
		</div>
	);
};

export default NotificationsSettings;
