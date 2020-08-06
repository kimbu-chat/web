import React, { useContext } from 'react';
import moment from 'moment';

import { UserPreview } from 'app/store/my-profile/models';
import { LocalizationContext } from 'app/app';

import StatusBadge from 'app/components/shared/status-badge';

namespace Member {
	export interface Props {
		member: UserPreview;
	}
}

const Member = ({ member }: Member.Props) => {
	const { t } = useContext(LocalizationContext);

	return (
		<div className='chat-members__member'>
			<StatusBadge user={member} />
			<div className='chat-members__data'>
				<h3>{`${member?.firstName} ${member?.lastName}`}</h3>
				<span>
					{member?.status === 1
						? t('chatData.online')
						: moment.utc(member?.lastOnlineTime).startOf('hour').fromNow()}
				</span>
			</div>
		</div>
	);
};

export default React.memo(Member);
