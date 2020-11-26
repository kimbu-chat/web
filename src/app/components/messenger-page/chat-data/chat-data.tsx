import React, { useContext } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { getChatInterlocutor, getInterlocutorInitials } from '../../../utils/functions/interlocutor-name-utils';

import './chat-data.scss';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import { UserPreview } from 'store/my-profile/models';
import { UserStatus } from 'store/friends/models';
import Avatar from 'app/components/shared/avatar/avatar';

import VoiceCallSvg from 'icons/ic-call.svg';
import VideoCallSvg from 'icons/ic-video-call.svg';
import ChatSearchSvg from 'icons/ic-search.svg';
import ChatInfoSvg from 'icons/ic-info.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';

export const ChatData = React.memo(() => {
	const { t } = useContext(LocalizationContext);
	const selectedChat = useSelector(getSelectedChatSelector);
	const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);

	const location = useLocation();

	const callWithVideo = () =>
		callInterlocutor({
			calling: selectedChat?.interlocutor as UserPreview,
			constraints: {
				videoEnabled: true,
				audioEnabled: true,
			},
		});

	const callWithAudio = () =>
		callInterlocutor({
			calling: selectedChat?.interlocutor as UserPreview,
			constraints: {
				videoEnabled: false,
				audioEnabled: true,
			},
		});

	if (selectedChat) {
		const imageUrl: string =
			selectedChat.groupChat?.avatar?.previewUrl || selectedChat?.interlocutor?.avatar?.previewUrl || '';
		const status = selectedChat.groupChat
			? `${selectedChat.groupChat.membersCount} ${t('chatData.members')}`
			: selectedChat?.interlocutor?.status === UserStatus.Online
			? t('chatData.online')
			: `${t('chatData.last-time')} ${moment
					.utc(selectedChat?.interlocutor?.lastOnlineTime)
					.local()
					.startOf('minute')
					.fromNow()}`;

		return (
			<div className={`chat-data__chat-data`}>
				<Link
					to={
						location.pathname.includes('info')
							? location.pathname.replace(/info\/?(photo|video|files|audio-recordings|audios)?\/?/, '')
							: location.pathname.replace(
									/(chats|contacts|settings|calls)\/?([0-9]{1,}|edit-profile|notifications|language|typing)?\/?/,
									(_all, groupOne, groupTwo) => `${groupOne}${groupTwo ? `/${groupTwo}` : ''}/info`,
							  )
					}
					className='chat-data__contact-data'
				>
					<Avatar className='chat-data__contact-img' src={imageUrl}>
						{getInterlocutorInitials(selectedChat)}
					</Avatar>

					<div className='chat-data__chat-info'>
						<h1>{getChatInterlocutor(selectedChat)}</h1>
						<p>{status}</p>
					</div>
				</Link>
				<div className='chat-data__buttons-group'>
					{selectedChat.interlocutor && (
						<button className='chat-data__button' onClick={callWithAudio}>
							<VoiceCallSvg />
						</button>
					)}
					{selectedChat.interlocutor && (
						<button className='chat-data__button' onClick={callWithVideo}>
							<VideoCallSvg />
						</button>
					)}
					<button className='chat-data__button'>
						<ChatSearchSvg />
					</button>
					<NavLink
						to={
							location.pathname.includes('info')
								? location.pathname.replace(
										/info\/?(photo|video|files|audio-recordings|audios)?\/?/,
										'',
								  )
								: location.pathname.replace(
										/(chats|contacts|settings|calls)\/?([0-9]{1,}|edit-profile|notifications|language|typing)?\/?/,
										(_all, groupOne, groupTwo) =>
											`${groupOne}${groupTwo ? `/${groupTwo}` : ''}/info`,
								  )
						}
						isActive={(match, location) => {
							if (match && location.pathname.includes('info')) {
								return true;
							} else {
								return false;
							}
						}}
						className='chat-data__button'
						activeClassName='chat-data__button--active'
					>
						<ChatInfoSvg />
					</NavLink>
				</div>
			</div>
		);
	} else return <div className='chat-data__chat-data'></div>;
});
