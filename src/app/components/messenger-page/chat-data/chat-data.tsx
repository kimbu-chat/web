import React, { useContext } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { getChatInterlocutor, getInterlocutorInitials } from '../../../utils/interlocutor-name-utils';

import './chat-data.scss';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';
import { UserPreview } from 'app/store/my-profile/models';
import { UserStatus } from 'app/store/friends/models';
import Avatar from 'app/components/shared/avatar/avatar';

import VoiceCallSvg from 'app/assets/icons/ic-call.svg';
import VideoCallSvg from 'app/assets/icons/ic-video-call.svg';
import ChatSearchSvg from 'app/assets/icons/ic-search.svg';
import ChatInfoSvg from 'app/assets/icons/ic-info.svg';

namespace ChatData {
	export interface Props {
		displayChatInfo: () => void;
		chatInfoDisplayed: boolean;
	}
}

const ChatData = ({ displayChatInfo, chatInfoDisplayed }: ChatData.Props) => {
	const { t } = useContext(LocalizationContext);
	const selectedChat = useSelector(getSelectedChatSelector);
	const callInterlocutor = useActionWithDispatch(CallActions.outgoingCallAction);

	const callWithVideo = () =>
		callInterlocutor({
			calling: selectedChat?.interlocutor as UserPreview,
			constraints: {
				video: {
					isOpened: true,
				},
				audio: {
					isOpened: true,
				},
			},
		});

	const callWithAudio = () =>
		callInterlocutor({
			calling: selectedChat?.interlocutor as UserPreview,
			constraints: {
				video: {
					isOpened: false,
				},
				audio: {
					isOpened: true,
				},
			},
		});

	if (selectedChat) {
		const imageUrl: string = selectedChat.conference?.avatarUrl || selectedChat?.interlocutor?.avatarUrl || '';
		const status = selectedChat.conference
			? `${selectedChat.conference.membersCount} ${t('chatData.members')}`
			: selectedChat?.interlocutor?.status === UserStatus.Online
			? t('chatData.online')
			: `${t('chatData.last-time')} ${moment
					.utc(selectedChat?.interlocutor?.lastOnlineTime)
					.local()
					.format('hh:mm')}`;

		return (
			<div className='chat-data__chat-data'>
				<div onClick={displayChatInfo} className='chat-data__contact-data'>
					<Avatar className='chat-data__contact-img' src={imageUrl}>
						{getInterlocutorInitials(selectedChat)}
					</Avatar>

					<div className='chat-data__chat-info'>
						<h1>{getChatInterlocutor(selectedChat)}</h1>
						<p>{status}</p>
					</div>
				</div>
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
					<button
						onClick={displayChatInfo}
						className={
							chatInfoDisplayed ? 'chat-data__button chat-data__button--active' : 'chat-data__button'
						}
					>
						<ChatInfoSvg />
					</button>
				</div>
			</div>
		);
	} else return <div className='chat-data__chat-data'></div>;
};

export default React.memo(
	ChatData,
	(prevProps, nextProps) => prevProps.chatInfoDisplayed === nextProps.chatInfoDisplayed,
);
