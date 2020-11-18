import React from 'react';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { Link, useLocation } from 'react-router-dom';

namespace SettingsHeader {
	export interface Props {
		title: string;
	}
}

const SettingsHeader = ({ title }: SettingsHeader.Props) => {
	const location = useLocation();

	return (
		<div className='settings__header'>
			<Link
				to={location.pathname.replace(
					/\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
					(_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/settings/${groupFour ? groupFour : ''}`,
				)}
				className='settings__back'
			>
				<ReturnSvg viewBox='0 0 25 25' />
			</Link>
			<div className='settings__title'>{title}</div>
		</div>
	);
};

export default SettingsHeader;
