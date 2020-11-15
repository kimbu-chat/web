import { Call, CallType } from 'app/store/calls/models';
import './call-from-list.scss';
import React, { useContext } from 'react';

import OutgoingCallSvg from 'app/assets/icons/ic-outgoing-call.svg';
import Avatar from 'app/components/shared/avatar/avatar';
import { getUserInitials } from 'app/utils/functions/interlocutor-name-utils';
import { LocalizationContext } from 'app/app';
import moment from 'moment';

namespace CallFromList {
	export interface Props {
		call: Call;
	}
}

const CallFromList: React.FC<CallFromList.Props> = ({ call }) => {
	const { t } = useContext(LocalizationContext);

	return (
		<div className='call-from-list'>
			<div className='call-from-list__type-icon'>{call.type === CallType.outgoing && <OutgoingCallSvg />}</div>
			<Avatar className='call-from-list__interlocutor-avatar' src={call.interlocutor.avatar?.previewUrl}>
				{getUserInitials(call.interlocutor)}
			</Avatar>
			<div className='call-from-list__data'>
				<div
					className={`call-from-list__name`}
				>{`${call.interlocutor.firstName} ${call.interlocutor.lastName}`}</div>
				<div className='call-from-list__type'>
					{call.type === CallType.canceled && t('callFromList.canceled')}
					{call.type === CallType.declined && t('callFromList.declined')}
					{call.type === CallType.incoming && t('callFromList.incoming')}
					{call.type === CallType.outgoing && t('callFromList.outgoing')}
				</div>
			</div>
			<div className='call-from-list__day'>{moment(call.date).format('DD.MM.YYYY')}</div>
		</div>
	);
};

export default CallFromList;
