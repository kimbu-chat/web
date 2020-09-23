import React, { useCallback, useContext } from 'react';
import './interlocutor-info.scss';

import InfoSvg from 'app/assets/icons/ic-info.svg';
import { useSelector } from 'react-redux';
import { ChatActions } from 'app/store/chats/actions';
import { Chat } from 'app/store/chats/models';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { AsYouType } from 'libphonenumber-js';
import { LocalizationContext } from 'app/app';

const InterlocutorInfo = () => {
	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const renameConference = useActionWithDispatch(ChatActions.renameConference);

	const setNewConferenceName = useCallback((newName: string) => renameConference({ newName, chat: selectedChat }), [
		renameConference,
		selectedChat,
	]);
	//!TODO This is a temporal console log placed in order to avoid ts warnings
	console.log(setNewConferenceName);

	return (
		<div className='interlocutor-info'>
			<h3 className='interlocutor-info__heading'>{t('interlocutorInfo.information')}</h3>
			<div className='interlocutor-info__info-block'>
				<InfoSvg className='interlocutor-info__info-svg' />
				<div className='interlocutor-info__data'>
					<div className='interlocutor-info__data-value'>
						{new AsYouType().input(selectedChat.interlocutor?.phoneNumber as string)}
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
		</div>
	);
};

export default InterlocutorInfo;
