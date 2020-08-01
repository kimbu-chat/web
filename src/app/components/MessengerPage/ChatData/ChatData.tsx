import React, { useContext } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { getDialogInterlocutor, getInterlocutorInitials } from '../../../utils/get-interlocutor';
import { Avatar } from '@material-ui/core';

import './ChatData.scss';
import { LocalizationContext } from 'app/app';
import StatusBadge from 'app/utils/StatusBadge';

namespace ChatData {
	export interface Props {
		displayChatInfo: () => void;
		chatInfoDisplayed: boolean;
	}
}

const ChatData = ({ displayChatInfo, chatInfoDisplayed }: ChatData.Props) => {
	const { t } = useContext(LocalizationContext);
	const selectedDialog = useSelector(getSelectedDialogSelector);

	if (selectedDialog) {
		const imageUrl: string = selectedDialog.conference?.avatarUrl || selectedDialog?.interlocutor?.avatarUrl || '';
		const status = selectedDialog.conference
			? `${selectedDialog.conference.membersCount} ${t('chatData.members')}`
			: selectedDialog?.interlocutor?.status === 1
			? t('chatData.online')
			: `${t('chatData.last-time')} ${moment
					.utc(selectedDialog?.interlocutor?.lastOnlineTime)
					.local()
					.format('hh:mm')}`;

		return (
			<div className='messenger__chat-data'>
				<div onClick={displayChatInfo} className='messenger__contact-data'>
					{selectedDialog.interlocutor ? (
						<StatusBadge
							additionalClassNames='messenger__contact-img'
							user={selectedDialog.interlocutor!}
						/>
					) : (
						<Avatar className='messenger__contact-img' src={imageUrl}>
							{getInterlocutorInitials(selectedDialog)}
						</Avatar>
					)}

					<div className='messenger__chat-info'>
						<h1>{getDialogInterlocutor(selectedDialog)}</h1>
						<p>{status}</p>
					</div>
				</div>
				<div className='messenger__buttons-group'>
					<button className='messenger__voice-call'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' e-dvz7b7=''>
							<path
								fillRule='evenodd'
								d='M16.955 15.669a2 2 0 00-2.606-.8c-.474.23-.688.332-.91.439-.502-.52-1.062-1.24-1.592-2.142a13.473 13.473 0 01-1.206-2.747l.634-.43.185-.125a2 2 0 00.61-2.657l-.765-1.322a2 2 0 00-2.753-.717 25.89 25.89 0 01-.866.518C5.6 6.829 5.2 10.75 7.86 15.355c2.644 4.579 6.275 6.171 8.272 4.958.156-.095.42-.255.92-.556a2 2 0 00.698-2.71l-.383-.665-.41-.713zm-.592 2.177a.4.4 0 01-.14.541l-.923.559c-.292.177-1.108.17-2.015-.228-1.367-.6-2.758-1.942-4.04-4.163-1.287-2.23-1.768-4.11-1.618-5.586.101-.994.5-1.7.828-1.88.18-.099.496-.288.925-.552a.4.4 0 01.54.15l.765 1.32a.4.4 0 01-.122.533l-.185.125-.634.429a1.6 1.6 0 00-.641 1.768 15.073 15.073 0 001.364 3.115 13.063 13.063 0 001.85 2.47c.509.48 1.221.589 1.817.3.215-.101.432-.206.914-.44a.4.4 0 01.521.16l.412.715.382.664z'
								clipRule='evenodd'
								e-dvz7b7=''
							></path>
						</svg>
					</button>
					<button className='messenger__video-call'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' e-dvz7b7=''>
							<path
								fillRule='evenodd'
								d='M15.83 8.46a2.3 2.3 0 00-2.3-2.3H9.47a6.3 6.3 0 000 12.6h4.06a2.3 2.3 0 002.3-2.3V14.1l2.84 2.37a1.3 1.3 0 002.13-1V9.2a1.3 1.3 0 00-2.13-1l-2.84 2.33V8.46zm-1.6 0v8a.7.7 0 01-.7.7H9.47a4.7 4.7 0 010-9.4h4.06a.7.7 0 01.7.7zm4.97 6.38l-3.02-2.52 3.02-2.48v5z'
								clipRule='evenodd'
								e-dvz7b7=''
							></path>
						</svg>
					</button>
					<button className='messenger__chat-search'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' e-dvz7b7=''>
							<path
								fillRule='evenodd'
								d='M11.14 5.2a5.95 5.95 0 014.71 9.57l3.22 3.22a.8.8 0 01-1.13 1.13l-3.23-3.23a5.95 5.95 0 11-3.57-10.7zm0 1.6a4.35 4.35 0 100 8.7 4.35 4.35 0 000-8.7z'
								clipRule='evenodd'
								e-dvz7b7=''
							></path>
						</svg>
					</button>
					<button
						onClick={displayChatInfo}
						className={
							chatInfoDisplayed
								? 'messenger__chat-info messenger__chat-info--blue'
								: 'messenger__chat-info'
						}
					>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' e-dvz7b7=''>
							<path
								fillRule='evenodd'
								d='M19.8 12a7.8 7.8 0 10-15.6 0 7.8 7.8 0 0015.6 0zm-14 0a6.2 6.2 0 1112.4 0 6.2 6.2 0 01-12.4 0zm5.42.55v1.92h-.02a.78.78 0 000 1.56h1.6c.43 0 .77-.35.77-.78a.78.78 0 00-.77-.78h-.02v-1.92h.02c.43 0 .77-.35.77-.78a.78.78 0 00-.77-.77h-1.6a.78.78 0 000 1.56h.02zm1.88-3.7a1.1 1.1 0 10-2.2 0 1.1 1.1 0 002.2 0z'
								clipRule='evenodd'
								e-dvz7b7=''
							></path>
						</svg>
					</button>
				</div>
			</div>
		);
	} else return <div className='messenger__chat-data'></div>;
};

export default ChatData;
