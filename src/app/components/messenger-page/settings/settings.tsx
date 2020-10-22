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
import { NavLink, Route, Switch, useLocation } from 'react-router-dom';
import EditProfile from './edit-profile/edit-profile';
import { Messenger } from 'app/containers/messenger/messenger';
import NotificationsSettings from './notifications-settings/notifications-settings';
import LanguageSettings from './language-settings/language-settings';

namespace Settings {
	export interface Props {
		setImageUrl: (url: string | null | ArrayBuffer) => void;
		displayChangePhoto: (data: Messenger.photoSelect) => void;
	}
}

const Settings = ({ displayChangePhoto, setImageUrl }: Settings.Props) => {
	const { t } = useContext(LocalizationContext);

	const myProfile = useSelector(getMyProfileSelector);

	const location = useLocation();

	return (
		<Switch location={location}>
			<Route path='/settings' exact>
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
						<NavLink to='/settings/edit-profile' className='settings__link'>
							<InfoSvg />
							<span className='settings__link-name'>{t('settings.edit_profile')}</span>
						</NavLink>
						<NavLink to='/settings/notifications' className='settings__link'>
							<NotificationSvg />
							<span className='settings__link-name'>{t('settings.notifications')}</span>
						</NavLink>
						<NavLink to='/settings/typing' className='settings__link'>
							<TextSvg />
							<span className='settings__link-name'>{t('settings.text_typing')}</span>
						</NavLink>
						<NavLink to='/settings/language' className='settings__link'>
							<LangSvg />
							<span className='settings__link-name'>{t('settings.language')}</span>
						</NavLink>
					</div>
				</div>
			</Route>

			<Route path='/settings/edit-profile'>
				<EditProfile displayChangePhoto={displayChangePhoto} setImageUrl={setImageUrl} />
			</Route>

			<Route path='/settings/notifications'>
				<NotificationsSettings />
			</Route>

			<Route path='/settings/language'>
				<LanguageSettings />
			</Route>
		</Switch>
	);
};

export default Settings;
