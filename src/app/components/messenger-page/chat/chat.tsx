import React, { useEffect, useRef, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './chat.scss';
import moment from 'moment';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { Message, MessageList, SystemMessageType } from 'app/store/messages/models';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import MessageItem from '../message-item/message-item';
import InfiniteScroll from 'react-infinite-scroller';
import SelectedMessagesData from '../selected-messages-data/selected-messages-data';
import { setSelectedMessagesLength } from 'app/store/messages/selectors';

export const MESSAGES_LIMIT = 25;

export enum messageFrom {
	me,
	others,
}

const Chat = () => {
	const getMessages = useActionWithDispatch(MessageActions.getMessages);
	const markMessagesAsRead = useActionWithDispatch(MessageActions.markMessagesAsRead);

	const { t, i18n } = useContext(LocalizationContext);

	const selectedDialog = useSelector(getSelectedDialogSelector);
	const messages = useSelector<RootState, Message[]>(
		(state) =>
			state.messages.messages.find((x: MessageList) => x.dialogId == selectedDialog?.id)?.messages as Message[],
	);
	const hasMoreMessages = useSelector<RootState, boolean>(
		(state) =>
			state.messages.messages.find((x: MessageList) => x.dialogId == selectedDialog?.id)
				?.hasMoreMessages as boolean,
	);
	const isSelectState = useSelector(setSelectedMessagesLength) > 0;

	const dateDifference = useCallback((startDate: Date, endDate: Date): boolean => {
		return Boolean(Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (24 * 60 * 60 * 1000))));
	}, []);

	useEffect(() => {
		if (selectedDialog) {
			console.log('loaded');
			//fetching first 25messages
			getMessages({
				page: {
					limit: MESSAGES_LIMIT,
					offset: 0,
				},
				dialog: selectedDialog,
				initiatedByScrolling: false,
			});

			//marking as read
			const markAsRead = (): void => {
				const { ownUnreadMessagesCount } = selectedDialog;
				if (Boolean(ownUnreadMessagesCount) && (ownUnreadMessagesCount || 0) > 0) {
					markMessagesAsRead(selectedDialog);
				}
			};

			markAsRead();
		}
	}, [selectedDialog?.id]);

	const loadPage = useCallback(() => {
		const pageData = {
			limit: MESSAGES_LIMIT,
			offset: messages?.length || 0,
		};

		if (selectedDialog) {
			getMessages({
				page: pageData,
				dialog: selectedDialog,
				initiatedByScrolling: false,
			});
		}
	}, [messages?.length, selectedDialog]);

	const messagesContainerRef = useRef(null);

	if (!selectedDialog || !messages) {
		return <div className='messenger__messages-list'></div>;
	}

	const messagesCopy: Message[] = JSON.parse(JSON.stringify(messages));
	const itemsWithDateSeparators = messagesCopy.map((message, index) => {
		if (index < messages.length - 1)
			if (
				index === messages.length - 1 ||
				dateDifference(
					new Date(message.creationDateTime || ''),
					new Date(messages[index + 1].creationDateTime || ''),
				)
			) {
				message.dateSeparator = moment
					.utc(message.creationDateTime)
					.local()
					.locale(i18n?.language || '')
					.format('dddd, MMMM D, YYYY')
					.toString();

				console.log(
					dateDifference(
						new Date(message.creationDateTime || ''),
						new Date(messages[index + 1].creationDateTime || ''),
					),
				);

				message.needToShowDateSeparator = true;
				return message;
			}

		message.needToShowDateSeparator = false;

		return message;
	});

	const itemsWithUserInfo = itemsWithDateSeparators
		.map((message, index) => {
			if (
				selectedDialog.conference &&
				index < messages.length - 1 &&
				(messages[index].userCreator?.id !== messages[index + 1].userCreator?.id ||
					messages[index + 1].systemMessageType !== SystemMessageType.None ||
					message.needToShowDateSeparator)
			) {
				console.log(message.text);
				message.needToShowCreator = true;
			}

			return message;
		})
		.reverse();

	return (
		<div className='messenger__messages-list'>
			<div ref={messagesContainerRef} className='messenger__messages-container'>
				{selectedDialog.isInterlocutorTyping && (
					<div className='messenger__typing-notification'>{`${selectedDialog.interlocutor?.firstName} ${
						selectedDialog.interlocutor?.lastName
					} ${t('chat.typing')}`}</div>
				)}

				{itemsWithUserInfo.length === 0 && (
					<div className='messenger__messages-list__empty'>
						<p>{t('chat.empty')}</p>
					</div>
				)}

				{isSelectState && <SelectedMessagesData />}

				<InfiniteScroll
					pageStart={0}
					loadMore={loadPage}
					hasMore={hasMoreMessages}
					loader={
						<div className='loader ' key={0}>
							<div className=''>
								<div className='lds-ellipsis'>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
						</div>
					}
					useWindow={false}
					getScrollParent={() => messagesContainerRef.current}
					isReverse={true}
				>
					{itemsWithUserInfo.map((msg) => {
						return <MessageItem message={msg} key={msg.id} />;
					})}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default React.memo(Chat);
