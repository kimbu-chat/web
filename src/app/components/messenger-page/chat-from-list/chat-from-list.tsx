import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';

import './chat-from-list.scss';
import { Dialog } from 'app/store/dialogs/models';
import { MessageUtils } from 'app/utils/message-utils';
import { getDialogInterlocutor, getInterlocutorInitials } from '../../../utils/interlocutor-name-utils';

import StatusBadge from 'app/components/shared/status-badge';
import _ from 'lodash';
import { ChatActions } from 'app/store/dialogs/actions';
import { SystemMessageType, Message } from 'app/store/messages/models';
import { LocalizationContext } from 'app/app';
import { getMyIdSelector } from 'app/store/my-profile/selectors';

import { Avatar } from '@material-ui/core';

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
			return _.truncate(
				MessageUtils.constructSystemMessageText(
					lastMessage as Message,
					lastMessage?.userCreator?.id === currentUserId,
					t,
				),
				{
					length: 19,
					omission: '...',
				},
			);
		}

		if (conference) {
			if (isMessageCreatorCurrentUser) {
				return _.truncate(`${t('chatFromList.you')}: ${lastMessage?.text}`, {
					length: 19,
					omission: '...',
				});
			}
			return _.truncate(`${lastMessage?.userCreator?.firstName}: ${lastMessage?.text}`, {
				length: 19,
				omission: '...',
			});
		}

		const shortedText = _.truncate(lastMessage?.text, {
			length: 19,
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
			className='messenger__chat-block'
			activeClassName='messenger__chat-block messenger__chat-block--active'
		>
			<div className='messenger__active-line'></div>
			{!conference ? (
				<StatusBadge user={dialog.interlocutor!} />
			) : (
				<Avatar src={getDialogAvatar()}>{getInterlocutorInitials(dialog)}</Avatar>
			)}

			<div className='messenger__name-and-message'>
				<div className='messenger__name'>{getDialogInterlocutor(dialog)}</div>
				<div className='flat'>
					{/* <img src={lastPhoto} alt="" className="messenger__last-photo" /> */}
					<div className='messenger__last-message'>
						{dialog.isInterlocutorTyping ? t('chatFromList.typing') : getMessageText()}
					</div>
				</div>
			</div>
			<div className='messenger__time-and-count'>
				<div className='messenger__time'>
					{moment.utc(lastMessage?.creationDateTime).local().format('hh:mm')}
				</div>
				{(dialog.ownUnreadMessagesCount || false) && (
					<div className={dialog.isMuted ? 'messenger__count messenger__count--muted' : 'messenger__count'}>
						{dialog.ownUnreadMessagesCount}
					</div>
				)}
			</div>
		</NavLink>
	);
};

export default React.memo(ChatFromList);
