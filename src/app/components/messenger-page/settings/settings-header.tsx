import React from 'react';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { Link } from 'react-router-dom';

namespace SettingsHeader {
	export interface Props {
		title: string;
	}
}

const SettingsHeader = ({ title }: SettingsHeader.Props) => {
	return (
		<div className='settings__header'>
			<Link to='/settings' className='settings__back'>
				<ReturnSvg viewBox='0 0 25 25' />
			</Link>
			<div className='settings__title'>{title}</div>
		</div>
	);
};

export default SettingsHeader;
