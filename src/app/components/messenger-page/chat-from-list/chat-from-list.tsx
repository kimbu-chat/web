import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';

import './chat-from-list.scss';
import { Dialog } from 'app/store/dialogs/models';
import { MessageUtils } from 'app/utils/message-utils';
import { getDialogInterlocutor, getInterlocutorInitials } from '../../../utils/interlocutor-name-utils';

import StatusBadge from 'app/components/shared/status-badge/status-badge';
import { ChatActions } from 'app/store/dialogs/actions';
import { SystemMessageType, Message, MessageState } from 'app/store/messages/models';
import { LocalizationContext } from 'app/app';
import { getMyIdSelector } from 'app/store/my-profile/selectors';
import Avatar from 'app/components/shared/avatar/avatar';
import truncate from 'lodash/truncate';

import MessageQeuedSvg from 'app/assets/icons/ic-time.svg';
import MessageSentSvg from 'app/assets/icons/ic-tick.svg';
import MessageReadSvg from 'app/assets/icons/ic-double_tick.svg';

namespace ChatFromList {
	export interface Props {
		dialog: Dialog;
	}
}

const ChatFromList = ({ dialog }: ChatFromList.Props) => {
	const { interlocutor, lastMessage, conference } = dialog;
	const { t } = useContext(LocalizationContext);
	const currentUserId = useSelector(getMyIdSelector) as number;
	const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;
	const changeSelectedDialog = useActionWithDispatch(ChatActions.changeSelectedChat);

	const getDialogAvatar = (): string => {
		if (interlocutor) {
			return interlocutor.avatarUrl as string;
		}

		return conference?.avatarUrl as string;
	};

	const getMessageText = (): string => {
		const { lastMessage, conference } = dialog;
		if (lastMessage && lastMessage?.systemMessageType !== SystemMessageType.None) {
			return truncate(
				MessageUtils.constructSystemMessageText(
					lastMessage as Message,
					lastMessage?.userCreator?.id === currentUserId,
					t,
				),
				{
					length: 53,
					omission: '...',
				},
			);
		}

		if (conference) {
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

	const setSelectedDialog = (): void => {
		changeSelectedDialog(dialog.id);
	};

	return (
		<NavLink
			onClick={setSelectedDialog}
			to={`/chats/${dialog.id}`}
			className='chat-from-list'
			activeClassName='chat-from-list chat-from-list--active'
		>
			<div className='chat-from-list__active-line'></div>
			{!conference ? (
				<StatusBadge additionalClassNames={'chat-from-list__avatar'} user={dialog.interlocutor!} />
			) : (
				<Avatar className={'chat-from-list__avatar'} src={getDialogAvatar()}>
					{getInterlocutorInitials(dialog)}
				</Avatar>
			)}

			<div className='chat-from-list__contents'>
				<div className='chat-from-list__heading'>
					<div className='chat-from-list__name'>{getDialogInterlocutor(dialog)}</div>
					<div className='chat-from-list__status'>
						{lastMessage?.state === MessageState.QUEUED && <MessageQeuedSvg />}
						{lastMessage?.state === MessageState.SENT && <MessageSentSvg />}
						{lastMessage?.state === MessageState.READ && <MessageReadSvg />}
					</div>
					<div className='chat-from-list__time'>
						{moment.utc(lastMessage?.creationDateTime).local().format('LT')}
					</div>
				</div>
				<div className='chat-from-list__last-message'>
					{dialog.isInterlocutorTyping ? t('chatFromList.typing') : getMessageText()}
				</div>
				{(dialog.ownUnreadMessagesCount || false) && (
					<div
						className={
							dialog.isMuted
								? 'chat-from-list__count chat-from-list__count--muted'
								: 'chat-from-list__count'
						}
					>
						{dialog.ownUnreadMessagesCount}
					</div>
				)}
			</div>
		</NavLink>
	);
};

export default React.memo(ChatFromList);
