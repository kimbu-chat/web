import Avatar from 'app/components/shared/avatar/avatar';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { LocalizationContext } from 'app/app';
import './settings.scss';

import InfoSvg from 'app/assets/icons/ic-info.svg';
import NotificationSvg from 'app/assets/icons/ic-notifications-on.svg';
import TextSvg from 'app/assets/icons/ic-text-typing.svg';
import LangSvg from 'app/assets/icons/ic-language.svg';

const Settings = () => {
	const { t } = useContext(LocalizationContext);

	const myProfile = useSelector(getMyProfileSelector);

	return (
		<div className='settings'>
			<div className='settings__account-info'>
				<Avatar className='settings__account-avatar' src={myProfile?.avatarUrl}>
					{getUserInitials(myProfile)}
				</Avatar>
				<div className='settings__account-data'>
					<div className='settings__account-name'>{`${myProfile?.firstName} ${myProfile?.lastName}`}</div>
					<div className='settings__account-status'>{t('settings.online')}</div>
				</div>
			</div>
			<div className='settings__links'>
				<div className='settings__link'>
					<InfoSvg />
					<span className='settings__link-name'>{t('settings.edit_profile')}</span>
				</div>
				<div className='settings__link'>
					<NotificationSvg />
					<span className='settings__link-name'>{t('settings.notifications')}</span>
				</div>
				<div className='settings__link'>
					<TextSvg />
					<span className='settings__link-name'>{t('settings.text_typing')}</span>
				</div>
				<div className='settings__link'>
					<LangSvg />
					<span className='settings__link-name'>{t('settings.language')}</span>
				</div>
			</div>
		</div>
	);
};

export default Settings;
