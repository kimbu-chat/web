import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import InfiniteScroll from 'react-infinite-scroller';
import './Chat.scss';
import MessageItem from '../message-item';
import { Message, MessageList } from 'app/store/messages/models';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MessageActions } from 'app/store/messages/actions';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { RootState } from 'app/store/root-reducer';

export enum messageFrom {
	me,
	others,
}

const Chat = () => {
	const getMessages = useActionWithDeferred(MessageActions.getMessages);
	const markMessagesAsRead = useActionWithDispatch(MessageActions.markMessagesAsRead);

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
	const myId = useSelector<RootState, number>((state) => state.myProfile.user.id);

	const messagesContainerRef = useRef(null);

	const loadPage = (page: number) => {
		const pageData = {
			limit: 25,
			offset: page * 25,
		};

		if (selectedDialog) {
			getMessages({
				page: pageData,
				dialog: selectedDialog,
				initiatedByScrolling: false,
			});
		}
	};

	useEffect(() => {
		loadPage(0);

		if (selectedDialog) {
			const markAsRead = (): void => {
				const { ownUnreadMessagesCount } = selectedDialog;
				if (Boolean(ownUnreadMessagesCount) && (ownUnreadMessagesCount || 0) > 0) {
					markMessagesAsRead(selectedDialog);
				}
			};

			markAsRead();
		}
	}, [selectedDialog?.id]);

	if (!selectedDialog || !messages) {
		return <div className='messenger__messages-list'></div>;
	}

	const messageIsFrom = (id: Number | undefined) => {
		if (id === myId) {
			return messageFrom.me;
		} else {
			return messageFrom.others;
		}
	};

	const dateDifference = (startDate: Date, endDate: Date): boolean => {
		return Boolean(Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (24 * 60 * 60 * 1000))));
	};

	const messagesWithSeparators = messages.map((message, index) => {
		if (index < messages.length)
			if (
				index === messages.length - 1 ||
				dateDifference(
					new Date(message.creationDateTime || ''),
					new Date(messages[index + 1].creationDateTime || ''),
				)
			) {
				message = {
					...message,
					needToShowDateSeparator: true,
				};
				return message;
			}
		message = {
			...message,
			needToShowDateSeparator: false,
		};
		return message;
	});

	const items = messagesWithSeparators
		.map((msg) => {
			return (
				<MessageItem
					message={msg}
					key={msg.id}
					from={messageIsFrom(msg.userCreator?.id)}
					content={msg.text}
					time={moment.utc(msg.creationDateTime).local().format('HH:mm')}
					needToShowDateSeparator={msg.needToShowDateSeparator}
					dateSeparator={
						msg.needToShowDateSeparator
							? moment.utc(msg.creationDateTime).local().format('DD MMMM').toString()
							: undefined
					}
				/>
			);
		})
		.reverse();

	return (
		<div className='messenger__messages-list'>
			<div ref={messagesContainerRef} className='messenger__messages-container'>
				<InfiniteScroll
					pageStart={0}
					loadMore={loadPage}
					hasMore={hasMoreMessages}
					loader={
						<div className='loader ' key={0}>
							<div className=''>
								<CircularProgress />
							</div>
						</div>
					}
					useWindow={false}
					getScrollParent={() => messagesContainerRef.current}
					isReverse={true}
				>
					{items}
				</InfiniteScroll>
			</div>
			{selectedDialog.isInterlocutorTyping && (
				<div className='messenger__typing-notification'>{`${selectedDialog.interlocutor?.firstName} ${selectedDialog.interlocutor?.lastName} печатает...`}</div>
			)}
		</div>
	);
};

export default Chat;
