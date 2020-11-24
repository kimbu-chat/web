import React from 'react';
import { getUserInitials } from 'utils/functions/interlocutor-name-utils';
import { UserPreview } from 'store/my-profile/models';
import { UserStatus } from 'store/friends/models';
import Avatar from '../avatar/avatar';

import './status-badge.scss';

namespace StatusBadge {
	export interface Props {
		user: UserPreview;
		additionalClassNames?: string;
		containerClassName?: string;
	}
}

const StatusBadge = ({ user, additionalClassNames, containerClassName }: StatusBadge.Props) => {
	if (user?.status === UserStatus.Online) {
		return (
			<div className={`status-badge ${containerClassName}`}>
				<span className='status-badge__indicator status-badge__indicator--online'></span>
				<Avatar className={additionalClassNames} src={user.avatar?.previewUrl}>
					{getUserInitials(user)}
				</Avatar>
			</div>
		);
	} else {
		return (
			<div className={`status-badge ${containerClassName}`}>
				<span className='status-badge__indicator status-badge__indicator--offline'></span>
				<Avatar className={additionalClassNames} src={user.avatar?.previewUrl}>
					{getUserInitials(user)}
				</Avatar>
			</div>
		);
	}
};

export default StatusBadge;
