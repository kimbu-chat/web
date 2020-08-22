import React, { useContext, useCallback } from 'react';
import { messageFrom } from '../chat/chat';
import { Message, SystemMessageType, MessageState } from 'app/store/messages/models';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import './message-item.scss';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CachedIcon from '@material-ui/icons/Cached';
import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { setSelectedMessagesLength } from 'app/store/messages/selectors';

namespace Message {
	export interface Props {
		from: messageFrom;
		content: string;
		time: string;
		needToShowDateSeparator: boolean | undefined;
		dateSeparator?: string;
		message: Message;
	}
}

const MessageItem = ({ from, content, time, needToShowDateSeparator, dateSeparator, message }: Message.Props) => {
	const currentUserId = useSelector(getMyIdSelector) as number;
	const selectedDialogId = useSelector(getSelectedDialogSelector)?.id;
	const isSelectState = useSelector(setSelectedMessagesLength) > 0;

	const { t } = useContext(LocalizationContext);

	const deleteMessage = useActionWithDispatch(MessageActions.deleteMessageSuccess);
	const selectMessage = useActionWithDispatch(MessageActions.selectMessage);
	const copyMessage = useActionWithDispatch(MessageActions.copyMessages);

	const selectThisMessage = useCallback(
		(event?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
			event?.stopPropagation();
			selectMessage({ dialogId: selectedDialogId as number, messageId: message.id });
		},
		[selectedDialogId, message.id],
	);

	const deleteThisMessage = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();

			deleteMessage({ dialogId: selectedDialogId as number, messageIds: [message.id] });
		},
		[selectedDialogId, message.id],
	);

	const copyThisMessage = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();
			copyMessage({ dialogId: selectedDialogId || -1, messageIds: [message.id] });
		},
		[selectedDialogId, message.id],
	);

	if (message?.systemMessageType !== SystemMessageType.None) {
		return (
			<React.Fragment>
				{needToShowDateSeparator && (
					<div className='message__separator'>
						<span>{dateSeparator}</span>
					</div>
				)}
				<div className='message__separator'>
					<span>
						{MessageUtils.constructSystemMessageText(
							message as Message,
							message?.userCreator?.id === currentUserId,
							t,
						)}
					</span>
				</div>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			{needToShowDateSeparator && (
				<div className='message__separator'>
					<span>{dateSeparator}</span>
				</div>
			)}
			<div
				className={`message__container 
				${from === messageFrom.me ? 'message__container--from-me' : 'message__container--from-others'} 
				${message.isSelected ? 'message__container--selected' : ''}
				${isSelectState ? 'pointer' : ''}`}
				onClick={isSelectState ? selectThisMessage : () => {}}
			>
				{message.isSelected && (
					<div
						className={`message__selected ${
							from === messageFrom.me ? 'message__selected--from-me' : 'message__selected--from-others'
						}`}
					>
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path d='M5.85 9.66l-.88-.98-.4-.45A.8.8 0 1 0 3.39 9.3l.4.44.87.98.73.82a1.5 1.5 0 0 0 2.28-.04l2.09-2.54 1.8-2.18.8-1a.8.8 0 0 0-1.23-1.01l-.81.99-1.8 2.18L6.5 10.4l-.65-.73z'></path>
							</svg>
						</div>
					</div>
				)}
				<div
					className={`message__btn-group ${
						from === messageFrom.me ? 'message__btn-group--from-me' : 'message__btn-group--from-others'
					}`}
				>
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
					<div
						className={`message__menu ${
							from === messageFrom.me ? 'message__menu--from-me' : 'message__menu--from-others'
						}`}
					>
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

				<div
					className={`message__item ${
						from === messageFrom.me ? 'message__item--from-me' : 'message__item--from-others'
					}`}
				>
					{content}
					<span className='message__time'>{time}</span>
					{from === messageFrom.me &&
						(message.state === MessageState.READ ? (
							<DoneAllIcon className='message__read' />
						) : message.state === MessageState.QUEUED ? (
							<CachedIcon className='message__read' />
						) : (
							<DoneIcon className='message__read' />
						))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default React.memo(MessageItem);
