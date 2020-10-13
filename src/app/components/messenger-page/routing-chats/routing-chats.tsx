import React from 'react';
import { NavLink } from 'react-router-dom';
import './routing-chats.scss';

import ContactSvg from 'app/assets/icons/ic-contacts.svg';
import CallSvg from 'app/assets/icons/ic-call-filled.svg';
import ChatsSvg from 'app/assets/icons/ic-chat.svg';
import SettingsSvg from 'app/assets/icons/ic-settings.svg';

const RoutingChats = () => {
	return (
		<div className='routing-chats'>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to='/contacts'
			>
				<ContactSvg viewBox='0 0 25 25' />
			</NavLink>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to='/calls'
			>
				<CallSvg viewBox='0 0 25 25' />
			</NavLink>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to='/chats'
			>
				<ChatsSvg viewBox='0 0 25 25' />
			</NavLink>
			<NavLink
				className='routing-chats__link'
				activeClassName='routing-chats__link routing-chats__link--active'
				to='/settings'
			>
				<SettingsSvg viewBox='0 0 25 25' />
			</NavLink>
		</div>
	);
};

export default React.memo(RoutingChats);
