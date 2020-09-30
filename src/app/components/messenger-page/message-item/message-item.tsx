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

	const messageIsFrom = useCallback((id: Number | undefined) => {
		if (id === myId) {
			return messageFrom.me;
		} else {
			return messageFrom.others;
		}
	}, []);

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

	const deleteThisMessage = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();

			deleteMessage({ chatId: selectedChatId as number, messageIds: [message.id] });
		},
		[selectedChatId, message.id],
	);

	const copyThisMessage = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();
			copyMessage({ chatId: selectedChatId || -1, messageIds: [message.id] });
		},
		[selectedChatId, message.id],
	);

	if (message?.systemMessageType !== SystemMessageType.None) {
		return (
			<React.Fragment>
				{message.needToShowDateSeparator && (
					<div className='message__separator message__separator--capitalized'>
						<span>
							{moment.utc(message.creationDateTime).local().format('dddd, MMMM D, YYYY').toString()}
						</span>
					</div>
				)}
				<div className='message__separator'>
					<span>{MessageUtils.constructSystemMessageText(message as Message, t, currentUserId)}</span>
				</div>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			{message.needToShowDateSeparator && (
				<div className='message__separator message__separator--capitalized'>
					<span>{moment.utc(message.creationDateTime).local().format('dddd, MMMM D, YYYY').toString()}</span>
				</div>
			)}
			<div
				className={`message__container 
				${message.isSelected ? 'message__container--selected' : ''}`}
				onClick={isSelectState ? selectThisMessage : () => {}}
			>
				<span className={`message__time ${from === messageFrom.others ? 'message__time--no-status' : ''}`}>
					{moment.utc(message.creationDateTime).local().format('LT')}
				</span>
				{from === messageFrom.me &&
					(message.state === MessageState.READ ? (
						<MessageReadSvg className='message__read' />
					) : message.state === MessageState.QUEUED ? (
						<MessageQeuedSvg className='message__read' />
					) : (
						<MessageSentSvg className='message__read' />
					))}
				<div className={`message__btn-group`}>
					<div className='message__btn message__btn--options'>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									className='svg-fill'
									fillRule='evenodd'
									d='M8 1.55c-.78 0-1.42.66-1.42 1.47 0 .8.64 1.46 1.42 1.46.79 0 1.42-.66 1.42-1.46 0-.81-.63-1.47-1.42-1.47zM6.54 8.01c0-.84.65-1.51 1.46-1.51.8 0 1.46.67 1.46 1.5 0 .84-.65 1.51-1.46 1.51-.8 0-1.46-.67-1.46-1.5zm0 5.03c0-.84.65-1.51 1.46-1.51.8 0 1.46.67 1.46 1.5 0 .84-.65 1.51-1.46 1.51-.8 0-1.46-.67-1.46-1.5z'
								></path>
							</svg>
						</div>
					</div>
					<div className={`message__menu`}>
						<button onClick={copyThisMessage} className='message__menu-item'>
							<div className='svg'>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
									<path
										className='svg-fill'
										fillRule='evenodd'
										d='M13 .2c1 0 1.8.8 1.8 1.8v8c0 1-.8 1.8-1.8 1.8h-2.2V13c0 1-.8 1.8-1.8 1.8H3c-1 0-1.8-.8-1.8-1.8V5C1.2 4 2 3.2 3 3.2h2.2V2C5.2 1 6 .2 7 .2h6zm-6.2 3H9c1 0 1.8.8 1.8 1.8v5.2H13c.1 0 .2 0 .2-.2V2c0-.1 0-.2-.2-.2H7c-.1 0-.2 0-.2.2v1.2zM9.2 5v8c0 .1 0 .2-.2.2H3c-.1 0-.2 0-.2-.2V5c0-.1 0-.2.2-.2h6c.1 0 .2 0 .2.2z'
										clipRule='evenodd'
									></path>
								</svg>
							</div>
							<span className='message__menu-item__text'>Копировать сообщение</span>
						</button>
						<button onClick={selectThisMessage} className='message__menu-item'>
							<div className='svg'>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
									<path
										className='svg-fill'
										fillRule='evenodd'
										d='M8 .72a7.3 7.3 0 110 14.6A7.3 7.3 0 018 .72zm0 1.6a5.7 5.7 0 10.02 11.4A5.7 5.7 0 008 2.32zM4.59 7.37a.85.85 0 011.2-.02l1.68 1.6 3.18-3.05a.85.85 0 011.18 1.22l-3.76 3.62a.85.85 0 01-1.18 0L4.6 8.58a.85.85 0 01-.02-1.2z'
										clipRule='evenodd'
									></path>
								</svg>
							</div>
							<span className='message__menu-item__text'>Выбрать</span>
						</button>
						<button onClick={deleteThisMessage} className='message__menu-item'>
							<div className='svg'>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
									<path
										className='svg-fill'
										fillRule='evenodd'
										d='M1.818 3.185l3.209.005v-.836a1.802 1.802 0 0 1 1.8-1.8H9.16a1.803 1.803 0 0 1 1.8 1.8v.847l3.206.005a.8.8 0 1 1-.003 1.6h-.386a.819.819 0 0 1 .005.081l.011 5.049v.027l.007 3.018a2.803 2.803 0 0 1-2.8 2.807H5.005a2.8 2.8 0 0 1-2.8-2.807l.007-3.045v-.018l.011-5.03c0-.035.002-.07.007-.102l-.415-.001a.8.8 0 1 1 .003-1.6zm1.999 1.603a.807.807 0 0 1 .006.103l-.011 5.03v.018l-.007 3.046a1.201 1.201 0 0 0 1.2 1.203H11a1.2 1.2 0 0 0 1.2-1.203l-.007-3.019V9.94l-.011-5.048c0-.03.001-.06.004-.088l-8.37-.015zm5.543-1.59l-2.733-.005v-.839a.2.2 0 0 1 .2-.2H9.16a.2.2 0 0 1 .2.2v.844zM5.714 6.542l-.029 5.715a.8.8 0 0 0 1.6.008l.029-5.715a.8.8 0 1 0-1.6-.008zM8.7 12.257l.028-5.715a.8.8 0 1 1 1.6.008l-.028 5.715a.8.8 0 0 1-1.6-.008z'
										clipRule='evenodd'
									></path>
								</svg>
							</div>
							<span className='message__menu-item__text'>Удалить</span>
						</button>
					</div>
					<div className='message__btn'>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									className='svg-fill'
									d='M7.73 1.32A1.8 1.8 0 0 1 8.8 2.96v1.6c1.54.3 2.7.87 3.8 1.8a9.32 9.32 0 0 1 3.15 5.2c.17.8-.27 1.62-1.08 1.78-.44.08-.83 0-1.19-.25a2.95 2.95 0 0 1-.53-.45l-.1-.1a8.57 8.57 0 0 0-4.05-1.88v1.4a1.8 1.8 0 0 1-3 1.33l-2.09-1.88L.77 8.87a1.8 1.8 0 0 1 0-2.67L3.7 3.53l2.08-1.9a1.8 1.8 0 0 1 1.94-.31zm.37 7.6c2.19.26 4.38 1.1 5.83 2.44l.13.12.04.04a7.79 7.79 0 0 0-2.52-3.93 6.8 6.8 0 0 0-3.7-1.57.8.8 0 0 1-.68-.8V2.96a.2.2 0 0 0-.33-.15l-2.09 1.9-2.94 2.67a.2.2 0 0 0 0 .3l2.94 2.64 2.09 1.88a.2.2 0 0 0 .33-.15V9.72a.8.8 0 0 1 .9-.8z'
								></path>
							</svg>
						</div>
					</div>
				</div>

				<div className={`message__item ${!message.needToShowCreator ? 'message__item--upcoming' : ''} }`}>
					{message.needToShowCreator && (
						<p className='message__sender-name'>{`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}</p>
					)}
					{message.text}
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
		</React.Fragment>
	);
};

export default React.memo(MessageItem);
