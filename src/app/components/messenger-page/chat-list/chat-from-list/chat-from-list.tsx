import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import './chat-from-list.scss';
import { Chat } from 'store/chats/models';
import { MessageUtils } from 'utils/functions/message-utils';
import { getChatInterlocutor, getInterlocutorInitials } from '../../../../utils/functions/interlocutor-name-utils';

import { StatusBadge, Avatar } from 'components';
import { SystemMessageType, Message, MessageState } from 'store/messages/models';
import { LocalizationContext } from 'app/app';
import { getMyIdSelector } from 'store/my-profile/selectors';
import truncate from 'lodash/truncate';

import MessageQeuedSvg from 'icons/ic-time.svg';
import MessageSentSvg from 'icons/ic-tick.svg';
import MessageReadSvg from 'icons/ic-double_tick.svg';
import { getTypingString } from 'store/chats/selectors';

namespace ChatFromList {
	export interface Props {
		chat: Chat;
	}
}

export const ChatFromList = React.memo(({ chat }: ChatFromList.Props) => {
	const { interlocutor, lastMessage, groupChat } = chat;
	const { t } = useContext(LocalizationContext);
	const currentUserId = useSelector(getMyIdSelector) as number;
	const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;

	const getChatAvatar = (): string => {
		if (interlocutor) {
			return interlocutor.avatar?.previewUrl as string;
		}

		return groupChat?.avatar?.previewUrl as string;
	};

	const getMessageText = (): string => {
		const { lastMessage, groupChat } = chat;
		if (lastMessage && lastMessage?.systemMessageType !== SystemMessageType.None) {
			return truncate(MessageUtils.constructSystemMessageText(lastMessage as Message, t, currentUserId), {
				length: 53,
				omission: '...',
			});
		}

		if (groupChat) {
			if (isMessageCreatorCurrentUser) {
				return truncate(`${t('chatFromList.you')}: ${lastMessage?.text}`, {
					length: 53,
					omission: '...',
				});
			}
			return truncate(`${lastMessage?.userCreator?.firstName}: ${lastMessage?.text}`, {
				length: 53,
				omission: '...',
			});
		}

		const shortedText = truncate(lastMessage?.text, {
			length: 53,
			omission: '...',
		});

		return shortedText;
	};

	return (
		<NavLink
			to={`/chats/${chat.id}`}
			className='chat-from-list'
			activeClassName='chat-from-list chat-from-list--active'
		>
			<div className='chat-from-list__active-line'></div>
			{!groupChat ? (
				<StatusBadge
					containerClassName='chat-from-list__avatar-container'
					additionalClassNames={'chat-from-list__avatar'}
					user={chat.interlocutor!}
				/>
			) : (
				<Avatar className={'chat-from-list__avatar chat-from-list__avatar-container'} src={getChatAvatar()}>
					{getInterlocutorInitials(chat)}
				</Avatar>
			)}

			<div className='chat-from-list__contents'>
				<div className='chat-from-list__heading'>
					<div className='chat-from-list__name'>{getChatInterlocutor(chat)}</div>
					<div className='chat-from-list__status'>
						{!(
							lastMessage?.systemMessageType !== SystemMessageType.None || !isMessageCreatorCurrentUser
						) && (
							<React.Fragment>
								{lastMessage?.state === MessageState.QUEUED && <MessageQeuedSvg />}
								{lastMessage?.state === MessageState.SENT && <MessageSentSvg />}
								{lastMessage?.state === MessageState.READ && <MessageReadSvg />}
							</React.Fragment>
						)}
					</div>
					<div className='chat-from-list__time'>
						{MessageUtils.checkIfDatesAreSameDate(new Date(lastMessage?.creationDateTime!), new Date())
							? moment.utc(lastMessage?.creationDateTime).local().format('dd MMM YY')
							: moment.utc(lastMessage?.creationDateTime).local().format('LT')}
					</div>
				</div>
				<div className='chat-from-list__last-message'>
					{(chat.typingInterlocutors?.length || 0) > 0 ? getTypingString(t, chat) : getMessageText()}
				</div>
				{(chat.ownUnreadMessagesCount || false) && (
					<div
						className={
							chat.isMuted
								? 'chat-from-list__count chat-from-list__count--muted'
								: 'chat-from-list__count'
						}
					>
						{chat.ownUnreadMessagesCount}
					</div>
				)}
			</div>
		</NavLink>
	);
});
