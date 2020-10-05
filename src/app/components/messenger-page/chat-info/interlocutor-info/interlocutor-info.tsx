import React, { useContext } from 'react';
import './interlocutor-info.scss';

import InfoSvg from 'app/assets/icons/ic-info.svg';
import LinkSvg from 'app/assets/icons/ic-links.svg';

import { useSelector } from 'react-redux';
import { Chat } from 'app/store/chats/models';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { parsePhoneNumber } from 'libphonenumber-js';
import { LocalizationContext } from 'app/app';
import { Link } from 'react-router-dom';

const InterlocutorInfo = () => {
	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	return (
		<div className='interlocutor-info'>
			<h3 className='interlocutor-info__heading'>{t('interlocutorInfo.information')}</h3>
			{/* interlocutor block */}
			{selectedChat.interlocutor && (
				<div className='interlocutor-info__info-block'>
					<InfoSvg className='interlocutor-info__info-svg' />
					<div className='interlocutor-info__data'>
						<div className='interlocutor-info__data-value'>
							{parsePhoneNumber(selectedChat.interlocutor?.phoneNumber).formatInternational()}
						</div>
						<div className='interlocutor-info__data-name'>{t('interlocutorInfo.mobile')}</div>
					</div>
				</div>
			)}
			{selectedChat.interlocutor && (
				<div className='interlocutor-info__info-block'>
					<InfoSvg className='interlocutor-info__info-svg' />
					<div className='interlocutor-info__data'>
						<div className='interlocutor-info__data-value'>{`@${selectedChat.interlocutor?.nickname}`}</div>
						<div className='interlocutor-info__data-name'>{t('interlocutorInfo.username')}</div>
					</div>
				</div>
			)}

			{/* conference block */}

			{selectedChat.conference && (
				<div className='interlocutor-info__info-block'>
					<InfoSvg className='interlocutor-info__info-svg' />
					<div className='interlocutor-info__data'>
						<div className='interlocutor-info__data-value'>
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
							been the industry's standard dummy text ever since the 1500s, when an unknown printer.
						</div>
						<div className='interlocutor-info__data-name'>{t('interlocutorInfo.about')}</div>
					</div>
				</div>
			)}
			{selectedChat.conference && (
				<div className='interlocutor-info__info-block'>
					<LinkSvg className='interlocutor-info__info-svg' />
					<div className='interlocutor-info__data'>
						<Link
							to={`/chats/${selectedChat.conference.id}2`}
							className='interlocutor-info__data-value interlocutor-info__data-value--link'
						>{`ravudi.com/chats/${selectedChat.conference.id}2`}</Link>
						<div className='interlocutor-info__data-name'>{t('interlocutorInfo.link')}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default InterlocutorInfo;
