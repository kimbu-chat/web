import React, { useCallback } from 'react';
import './friend-from-list.scss';

import Avatar from 'app/components/shared/avatar/avatar';
import { UserPreview } from 'store/my-profile/models';
import { getUserInitials } from 'utils/functions/interlocutor-name-utils';

import SelectedSvg from 'icons/ic-check-filled.svg';
import UnSelectedSvg from 'icons/ic-check-outline.svg';

namespace FriendFromList {
	export interface Props {
		changeSelectedState?: (id: number) => void;
		isSelected?: boolean;
		friend: UserPreview;
		onClick?: (user: UserPreview) => void;
	}
}

export const FriendFromList = React.memo(
	({ changeSelectedState, friend, isSelected, onClick }: FriendFromList.Props) => {
		const onClickOnThisContact = useCallback(() => {
			if (onClick) {
				onClick(friend);
			}

			if (changeSelectedState) {
				changeSelectedState(friend.id);
			}
		}, [changeSelectedState, onClick]);

		return (
			<div onClick={onClickOnThisContact} className='friend-from-list__friend'>
				{changeSelectedState && (
					<div className='friend-from-list__selected-holder'>
						{isSelected ? <SelectedSvg /> : <UnSelectedSvg />}
					</div>
				)}
				<Avatar className={'friend-from-list__avatar'} src={friend.avatar?.previewUrl}>
					{getUserInitials(friend)}
				</Avatar>
				<span className='friend-from-list__friend-name'>{`${friend.firstName} ${friend.lastName}`}</span>
			</div>
		);
	},
);
