import React, { useContext } from 'react';
import './interlocutor-info.scss';

import InfoSvg from 'icons/ic-info.svg';
import LinkSvg from 'icons/ic-links.svg';

import { useSelector } from 'react-redux';
import { Chat } from 'store/chats/models';
import { getSelectedChatSelector } from 'store/chats/selectors';
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
				<>
					<div className='interlocutor-info__info-block'>
						<InfoSvg className='interlocutor-info__info-svg' />
						<div className='interlocutor-info__data'>
							<div className='interlocutor-info__data-value'>
								{parsePhoneNumber(selectedChat.interlocutor?.phoneNumber).formatInternational()}
							</div>
							<div className='interlocutor-info__data-name'>{t('interlocutorInfo.mobile')}</div>
						</div>
					</div>
					<div className='interlocutor-info__info-block'>
						<InfoSvg className='interlocutor-info__info-svg' />
						<div className='interlocutor-info__data'>
							<div className='interlocutor-info__data-value'>{`@${selectedChat.interlocutor?.nickname}`}</div>
							<div className='interlocutor-info__data-name'>{t('interlocutorInfo.username')}</div>
						</div>
					</div>
				</>
			)}

			{/* groupChat block */}

			{selectedChat.groupChat && (
				<div className='interlocutor-info__info-block'>
					<InfoSvg className='interlocutor-info__info-svg' />
					<div className='interlocutor-info__data'>
						<div className='interlocutor-info__data-value'>{selectedChat.groupChat!.description}</div>
						<div className='interlocutor-info__data-name'>{t('interlocutorInfo.about')}</div>
					</div>
				</div>
			)}
			{selectedChat.groupChat && (
				<div className='interlocutor-info__info-block'>
					<LinkSvg className='interlocutor-info__info-svg' />
					<div className='interlocutor-info__data'>
						<Link
							to={`/chats/${selectedChat.groupChat.id}2`}
							className='interlocutor-info__data-value interlocutor-info__data-value--link'
						>{`ravudi.com/chats/${selectedChat.groupChat.id}2`}</Link>
						<div className='interlocutor-info__data-name'>{t('interlocutorInfo.link')}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default InterlocutorInfo;
