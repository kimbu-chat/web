import React, { useCallback } from 'react';
import './contact-item.scss';

import StatusBadge from 'app/components/shared/status-badge/status-badge';

import { UserPreview } from 'app/store/my-profile/models';

namespace ContactItem {
	export interface Props {
		user: UserPreview;
		onClick: (user: UserPreview) => void;
	}
}

const ContactItem = ({ user, onClick }: ContactItem.Props) => {
	const clickOnContact = useCallback(() => {
		onClick(user);
	}, [user, onClick]);

	return (
		<div onClick={clickOnContact} className='friend-item'>
			<StatusBadge containerClassName={'friend-item__avatar'} user={user} />
			<div className='friend-item__name'>{`${user.firstName} ${user.lastName}`}</div>
		</div>
	);
};

export default React.memo(ContactItem);
