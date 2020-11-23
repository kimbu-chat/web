import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './routing-chats.scss';

import ContactSvg from 'app/assets/icons/ic-contacts.svg';
import CallSvg from 'app/assets/icons/ic-call-filled.svg';
import ChatsSvg from 'app/assets/icons/ic-chat.svg';
import SettingsSvg from 'app/assets/icons/ic-settings.svg';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { useSelector } from 'react-redux';

const RoutingChats = () => {
	const selectedChatId = useSelector(getSelectedChatSelector)?.id;
	const location = useLocation();

	return (
		<div className='routing-chats'>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to={location.pathname.replace(
					/\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
					(_all, _groupOne, _groupTwo, _groupThree, groupFour) =>
						`/contacts${selectedChatId ? `/${selectedChatId}` : ''}/${groupFour ? groupFour : ''}`,
				)}
			>
				<ContactSvg viewBox='0 0 25 25' />
			</NavLink>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to={location.pathname.replace(
					/\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
					(_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/calls/${groupFour ? groupFour : ''}`,
				)}
			>
				<CallSvg viewBox='0 0 25 25' />
			</NavLink>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to={location.pathname.replace(
					/\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
					(_all, _groupOne, _groupTwo, _groupThree, groupFour) =>
						`/chats${selectedChatId ? `/${selectedChatId}/${groupFour ? groupFour : ''}` : ''}`,
				)}
			>
				<ChatsSvg viewBox='0 0 25 25' />
			</NavLink>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to={location.pathname.replace(
					/\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
					(_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/settings/${groupFour ? groupFour : ''}`,
				)}
			>
				<SettingsSvg viewBox='0 0 25 25' />
			</NavLink>
		</div>
	);
};

export default React.memo(RoutingChats);
