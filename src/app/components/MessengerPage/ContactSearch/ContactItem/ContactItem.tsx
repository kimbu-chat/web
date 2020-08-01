import React from 'react';
import './_ContactItem.scss';
import StatusBadge from 'app/utils/StatusBadge';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { UserPreview } from 'app/store/my-profile/models';
import { RootState } from 'app/store/root-reducer';
import { FriendActions } from 'app/store/friends/actions';

namespace ContactItem {
	export interface Props {
		user: UserPreview;
		isSelectable?: boolean;
		displayMyself?: boolean;
	}
}

const ContactItem = ({ user, isSelectable, displayMyself }: ContactItem.Props) => {
	const myId = useSelector<RootState, number>((state) => state.myProfile.user.id);
	const markUser = useActionWithDispatch(FriendActions.markUserAsAddedToConference);
	const selectUser = () => markUser(user.id || -1);

	if (user.id === myId && !displayMyself) {
		return <div className=''></div>;
	}

	return (
		<div onClick={isSelectable ? selectUser : () => {}} className='messenger__friend-item'>
			<StatusBadge user={user} />
			<div className='messenger__friend-item__name'>{`${user.firstName} ${user.lastName}`}</div>
			{isSelectable && (
				<div
					className={
						user.supposedToAddIntoConference
							? 'messenger__friend-item__supposed messenger__friend-item__supposed--true'
							: 'messenger__friend-item__supposed messenger__friend-item__supposed--false'
					}
				>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path d='M5.85 9.66l-.88-.98-.4-.45A.8.8 0 1 0 3.39 9.3l.4.44.87.98.73.82a1.5 1.5 0 0 0 2.28-.04l2.09-2.54 1.8-2.18.8-1a.8.8 0 0 0-1.23-1.01l-.81.99-1.8 2.18L6.5 10.4l-.65-.73z'></path>
						</svg>
					</div>
				</div>
			)}
		</div>
	);
};

export default ContactItem;
