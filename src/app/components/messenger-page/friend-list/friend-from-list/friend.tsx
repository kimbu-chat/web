import { LocalizationContext } from 'app/app';
import Avatar from 'app/components/shared/avatar/avatar';
import { UserStatus } from 'app/store/friends/models';
import { UserPreview } from 'app/store/my-profile/models';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import moment from 'moment';
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './friend.scss';

namespace Friend {
	export interface Props {
		friend: UserPreview;
	}
}

const Friend = ({ friend }: Friend.Props) => {
	const { t } = useContext(LocalizationContext);

	return (
		<NavLink to={`/chat/${friend.id}1`} className='friend' activeClassName='friend--active'>
			<div className='friend__active-line'></div>
			<Avatar className={'friend__avatar'} src={friend.avatarUrl}>
				{getUserInitials(friend)}
			</Avatar>
			<div className='friend__contents'>
				<div className='friend__heading'>
					<div className='friend__name'>{`${friend.firstName} ${friend.lastName}`}</div>
					<div className='friend__status'>
						{friend.status === UserStatus.Online
							? t('chatData.online')
							: `${t('chatData.last-time')} ${moment
									.utc(friend.lastOnlineTime)
									.startOf('hour')
									.fromNow()}`}
					</div>
				</div>
			</div>
		</NavLink>
	);
};

export default Friend;
