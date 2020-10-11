import React from 'react';
import './friend-from-list.scss';

import Avatar from 'app/components/shared/avatar/avatar';
import { UserPreview } from 'app/store/my-profile/models';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';

import SelectedSvg from 'app/assets/icons/ic-check-filled.svg';
import UnSelectedSvg from 'app/assets/icons/ic-check-outline.svg';

namespace FriendFromList {
	export interface Props {
		changeSelectedState: (id: number) => void;
		isSelected: boolean;
		friend: UserPreview;
	}
}

const FriendFromList = ({ changeSelectedState, friend, isSelected }: FriendFromList.Props) => {
	return (
		<div onClick={() => changeSelectedState(friend.id)} className='friend-from-list__friend'>
			<div className='friend-from-list__selected-holder'>{isSelected ? <SelectedSvg /> : <UnSelectedSvg />}</div>
			<Avatar className={'friend-from-list__avatar'} src={friend.avatarUrl}>
				{getUserInitials(friend)}
			</Avatar>
			<span className='friend-from-list__friend-name'>{`${friend.firstName} ${friend.lastName}`}</span>
		</div>
	);
};

export default FriendFromList;