import Avatar from 'app/components/shared/avatar/avatar';
import React from 'react';
import './call-list.scss';

import OutgoingCallSvg from 'app/assets/icons/ic-outgoing-call.svg';

const CallList = () => {
	return (
		<div className='call-list'>
			<div className='call-list__call'>
				<div className='call-list__call__type-icon'>
					<OutgoingCallSvg />
				</div>
				<Avatar
					className='call-list__call__interlocutor-avatar'
					src={'https://i.imgur.com/2zQpfSB_d.webp?maxwidth=728&fidelity=grand'}
				>
					A E
				</Avatar>
				<div className='call-list__call__data'>
					<div className='call-list__call__name'>Leonard Bell</div>
					<div className='call-list__call__type'>Outgoing</div>
				</div>
				<div className='call-list__call__day'>10.09.20</div>
			</div>
			<div className='call-list__call'>
				<div className='call-list__call__type-icon'></div>
				<Avatar
					className='call-list__call__interlocutor-avatar'
					src={'https://i.imgur.com/2zQpfSB_d.webp?maxwidth=728&fidelity=grand'}
				>
					A E
				</Avatar>
				<div className='call-list__call__data'>
					<div className='call-list__call__name'>Addie Estrada</div>
					<div className='call-list__call__type'>Incoming (2 min)</div>
				</div>
				<div className='call-list__call__day'>10.09.20</div>
			</div>
			<div className='call-list__call'>
				<div className='call-list__call__type-icon'></div>
				<Avatar
					className='call-list__call__interlocutor-avatar'
					src={'https://i.imgur.com/2zQpfSB_d.webp?maxwidth=728&fidelity=grand'}
				>
					A E
				</Avatar>
				<div className='call-list__call__data'>
					<div className='call-list__call__name call-list__call__name--missed'>Franklin Gordon</div>
					<div className='call-list__call__type'>Missed</div>
				</div>
				<div className='call-list__call__day'>10.09.20</div>
			</div>
		</div>
	);
};

export default CallList;
