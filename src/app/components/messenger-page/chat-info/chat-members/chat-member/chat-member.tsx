import React, { useContext } from 'react';
import moment from 'moment';

import './chat-member.scss';

import { UserPreview } from 'app/store/my-profile/models';
import { LocalizationContext } from 'app/app';
import Avatar from 'app/components/shared/avatar/avatar';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { UserStatus } from 'app/store/friends/models';

import DeleteSvg from 'app/assets/icons/ic-delete.svg';

namespace Member {
	export interface Props {
		member: UserPreview;
	}
}

const Member = ({ member }: Member.Props) => {
	const { t, i18n } = useContext(LocalizationContext);

	return (
		<div className='chat-member'>
			<Avatar className='chat-member__avatar' src={member?.avatarUrl}>
				{getUserInitials(member)}
			</Avatar>
			<div className='chat-member__data'>
				<h3 className='chat-member__name'>{`${member?.firstName} ${member?.lastName}`}</h3>

				{member?.status === UserStatus.Offline ? (
					<span className='chat-member__status chat-member__status--offline'>{t('chatData.online')}</span>
				) : (
					<span className='chat-member__status chat-member__status--online'>
						{' '}
						{moment
							.utc(member?.lastOnlineTime)
							.startOf('hour')
							.locale(i18n?.language || '')
							.fromNow()}
					</span>
				)}
			</div>
			<h3 className={`chat-member__conference-status`}>
				{member.firstName.includes('77') ? (
					'Owner'
				) : (
					<button className='chat-member__delete-user'>
						<DeleteSvg viewBox='0 0 25 25' />
					</button>
				)}
			</h3>
		</div>
	);
};

export default React.memo(Member);
