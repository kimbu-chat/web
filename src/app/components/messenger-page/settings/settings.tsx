import Avatar from 'app/components/shared/avatar/avatar';
import { getMyProfileSelector } from 'store/my-profile/selectors';
import { getUserInitials } from 'utils/functions/interlocutor-name-utils';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { LocalizationContext } from 'app/app';
import './settings.scss';

import InfoSvg from 'icons/ic-info.svg';
import NotificationSvg from 'icons/ic-notifications-on.svg';
import TextSvg from 'icons/ic-text-typing.svg';
import LangSvg from 'icons/ic-language.svg';
import { Link, Route, useLocation } from 'react-router-dom';
import EditProfile from './edit-profile/edit-profile';
import NotificationsSettings from './notifications-settings/notifications-settings';
import LanguageSettings from './language-settings/language-settings';
import { CSSTransition } from 'react-transition-group';
import TextTyping from './text-typing/text-typing';
import BaseBtn from 'app/components/shared/base-btn/base-btn';
import { AuthActions } from 'store/auth/actions';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';

export const Settings = React.memo(() => {
	const { t } = useContext(LocalizationContext);

	const logout = useActionWithDispatch(AuthActions.logout);

	const myProfile = useSelector(getMyProfileSelector);

	const location = useLocation();

	return (
		<>
			<Route path='/settings/(info)?/(photo|video|audio-recordings|files|audios)?' exact>
				{({ match }) => (
					<CSSTransition in={match != null} timeout={200} classNames='settings-slide' unmountOnExit>
						<div className='settings'>
							<div className='settings__account-info'>
								<Avatar className='settings__account-avatar' src={myProfile?.avatar?.previewUrl}>
									{getUserInitials(myProfile)}
								</Avatar>
								<div className='settings__account-data'>
									<div className='settings__account-name'>{`${myProfile?.firstName} ${myProfile?.lastName}`}</div>
									<div className='settings__account-status'>{t('settings.online')}</div>
								</div>
							</div>
							<div className='settings__links'>
								<Link
									to={location.pathname.replace('settings', 'settings/edit-profile')}
									className='settings__link'
								>
									<InfoSvg />
									<span className='settings__link-name'>{t('settings.edit_profile')}</span>
								</Link>
								<Link
									to={location.pathname.replace('settings', 'settings/notifications')}
									className='settings__link'
								>
									<NotificationSvg />
									<span className='settings__link-name'>{t('settings.notifications')}</span>
								</Link>
								<Link
									to={location.pathname.replace('settings', 'settings/typing')}
									className='settings__link'
								>
									<TextSvg />
									<span className='settings__link-name'>{t('settings.text_typing')}</span>
								</Link>
								<Link
									to={location.pathname.replace('settings', 'settings/language')}
									className='settings__link'
								>
									<LangSvg />
									<span className='settings__link-name'>{t('settings.language')}</span>
								</Link>
							</div>
							<BaseBtn
								onClick={logout}
								width='contained'
								variant={'contained'}
								color='primary'
								className='settings__logout-btn'
							>
								{t('settings.logout')}
							</BaseBtn>
						</div>
					</CSSTransition>
				)}
			</Route>

			<Route path='/settings/edit-profile/(info)?/(photo|video|audio-recordings|files|audios)?' exact>
				{({ match }) => (
					<CSSTransition in={match != null} timeout={200} classNames='settings-slide' unmountOnExit>
						<EditProfile />
					</CSSTransition>
				)}
			</Route>

			<Route path='/settings/notifications/(info)?/(photo|video|audio-recordings|files|audios)?' exact>
				{({ match }) => (
					<CSSTransition in={match != null} timeout={200} classNames='settings-slide' unmountOnExit>
						<NotificationsSettings />
					</CSSTransition>
				)}
			</Route>

			<Route path='/settings/language/(info)?/(photo|video|audio-recordings|files|audios)?' exact>
				{({ match }) => (
					<CSSTransition in={match != null} timeout={200} classNames='settings-slide' unmountOnExit>
						<LanguageSettings />
					</CSSTransition>
				)}
			</Route>

			<Route path='/settings/typing/(info)?/(photo|video|audio-recordings|files|audios)?' exact>
				{({ match }) => (
					<CSSTransition in={match != null} timeout={200} classNames='settings-slide' unmountOnExit>
						<TextTyping />
					</CSSTransition>
				)}
			</Route>
		</>
	);
});
