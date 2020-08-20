import React, { useContext } from 'react';
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
	const { t } = useContext(LocalizationContext);

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
				className={`message__container ${
					from === messageFrom.me ? 'message__container--from-me' : 'message__container--from-others'
				}`}
			>
				{from === messageFrom.me && (
					<div className='message__btn-group'>
						<div className='message__btn'>
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
				)}

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

				{from === messageFrom.others && (
					<div className='message__btn-group'>
						<div className='message__btn'>
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
				)}
			</div>
		</React.Fragment>
	);
};

export default React.memo(MessageItem);
