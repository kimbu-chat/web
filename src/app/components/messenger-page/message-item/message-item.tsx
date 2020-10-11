import React, { useContext, useCallback } from 'react';
import { messageFrom } from '../chat/chat';
import { Message, SystemMessageType, MessageState } from 'app/store/messages/models';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import './message-item.scss';

import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { setSelectedMessagesLength } from 'app/store/messages/selectors';
import Avatar from 'app/components/shared/avatar/avatar';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { UserPreview } from 'app/store/my-profile/models';
import moment from 'moment';

import MessageQeuedSvg from 'app/assets/icons/ic-time.svg';
import MessageSentSvg from 'app/assets/icons/ic-tick.svg';
import MessageReadSvg from 'app/assets/icons/ic-double_tick.svg';
import SelectedSvg from 'app/assets/icons/ic-check-filled.svg';
import UnSelectedSvg from 'app/assets/icons/ic-check-outline.svg';

namespace Message {
	export interface Props {
		message: Message;
	}
}

const MessageItem = ({ message }: Message.Props) => {
	const currentUserId = useSelector(getMyIdSelector) as number;
	const selectedChatId = useSelector(getSelectedChatSelector)?.id;
	const isSelectState = useSelector(setSelectedMessagesLength) > 0;
	const myId = useSelector(getMyIdSelector) as number;

	const messageIsFrom = useCallback(
		(id: Number | undefined) => {
			if (id === myId) {
				return messageFrom.me;
			} else {
				return messageFrom.others;
			}
		},
		[myId],
	);

	const from = messageIsFrom(message.userCreator?.id);

	const { t } = useContext(LocalizationContext);

	const deleteMessage = useActionWithDispatch(MessageActions.deleteMessageSuccess);
	const selectMessage = useActionWithDispatch(MessageActions.selectMessage);
	const copyMessage = useActionWithDispatch(MessageActions.copyMessages);

	const selectThisMessage = useCallback(
		(event?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
			event?.stopPropagation();
			selectMessage({ chatId: selectedChatId as number, messageId: message.id });
		},
		[selectedChatId, message.id],
	);

	//TODO: This function is actually working well, just place it in the right place when ui is implemented
	//@ts-ignore
	const deleteThisMessage = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();

			deleteMessage({ chatId: selectedChatId as number, messageIds: [message.id] });
		},
		[selectedChatId, message.id],
	);

	//TODO: This function is actually working well, just place it in the right place when ui is implemented
	//@ts-ignore
	const copyThisMessage = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();
			copyMessage({ chatId: selectedChatId || -1, messageIds: [message.id] });
		},
		[selectedChatId, message.id],
	);

	if (message?.systemMessageType !== SystemMessageType.None) {
		return (
			<div className='message__separator'>
				<span>{MessageUtils.constructSystemMessageText(message as Message, t, currentUserId)}</span>
			</div>
		);
	}

	return (
		<div
			className={`message__container 
				${message.isSelected ? 'message__container--selected' : ''}`}
			onClick={isSelectState ? selectThisMessage : () => {}}
		>
			<div className={`message__item ${!message.needToShowCreator ? 'message__item--upcoming' : ''} }`}>
				{message.needToShowCreator && (
					<p className='message__sender-name'>{`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}</p>
				)}
				<div className='message__item-apart'>
					<span className='message__contents'>{message.text}</span>

					<div className='message__time-status'>
						{from === messageFrom.me &&
							(message.state === MessageState.READ ? (
								<MessageReadSvg viewBox='0 0 25 25' className='message__read' />
							) : message.state === MessageState.QUEUED ? (
								<MessageQeuedSvg viewBox='0 0 25 25' className='message__read' />
							) : (
								<MessageSentSvg viewBox='0 0 25 25' className='message__read' />
							))}

						<span className={`message__time`}>
							{moment.utc(message.creationDateTime).local().format('LT')}
						</span>
					</div>
				</div>
			</div>
			{message.needToShowCreator && (
				<Avatar className={`message__sender-photo `} src={message.userCreator?.avatarUrl}>
					{getUserInitials(message.userCreator as UserPreview)}
				</Avatar>
			)}

			<div onClick={selectThisMessage} className={`message__selected`}>
				{message.isSelected ? <SelectedSvg /> : <UnSelectedSvg className={`message__unselected`} />}
			</div>
		</div>
	);
};

export default React.memo(MessageItem);
